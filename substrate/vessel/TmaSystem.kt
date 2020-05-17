package substrate.vessel

import api.Actions
import api.Systems
import api.Updates
import java.time.Instant

class TmaSystem(vessel: Vessel, val descriptor: Systems.TmaSystem) : VesselSystem(vessel) {

    private val lock = Any()
    private val contacts = HashMap<String, Updates.TmaSystemUpdate.TmaContact>()
    private var nextSonarDesignationNumber = 1
    private var nextMergeDesignationNumber = 1

    override fun getSystemUpdate(): Updates.SystemUpdate {
        synchronized(lock) {
            return Updates.SystemUpdate.newBuilder().setTmaUpdate(
                    Updates.TmaSystemUpdate.newBuilder()
                            .addAllContacts(contacts.values)
            ).build()
        }
    }

    override fun processRequest(request: Actions.SystemRequest) {
        if (!request.hasTmaRequest()) {
            return
        }
        val tmaRequest = request.tmaRequest
        when {
            tmaRequest.hasAddContactRequest() -> addContact()
            tmaRequest.hasTakeBearingRequest() -> takeBearing(tmaRequest.takeBearingRequest)
            tmaRequest.hasMergeContactRequest() -> mergeContact(tmaRequest.mergeContactRequest)
            tmaRequest.hasDeleteContactRequest() -> deleteContact(tmaRequest.deleteContactRequest)
            tmaRequest.hasUploadSolutionRequest() -> uploadSolution(tmaRequest.uploadSolutionRequest)
            tmaRequest.hasDeleteBearingRequest() -> deleteBearing(tmaRequest.deleteBearingRequest)
        }
    }

    fun getContactList(): List<Updates.TmaSystemUpdate.TmaContact> {
        return contacts.values.toList()
    }

    private fun addContact() {
        synchronized(lock) {
            val designation = "S$nextSonarDesignationNumber"
            nextSonarDesignationNumber += 1
            contacts[designation] = Updates.TmaSystemUpdate.TmaContact.newBuilder()
                    .setDesignation(designation)
                    .build()
        }
    }

    private fun takeBearing(request: Actions.TmaSystemRequest.TmaTakeBearingSubrequest) {
        synchronized(lock) {
            val builder = contacts[request.designation]?.toBuilder()
                    ?: throw NoSuchContactException("Expected to find contact with designation ${request.designation}")
            builder.addBearings(Updates.TmaSystemUpdate.TmaContact.Bearing.newBuilder()
                    .setBearingDegrees(request.bearingDegrees)
                    .setEpochMillis(request.epochMillis)
                    .setLocation(vessel.positionBuffer.getNearestPositionAt(Instant.ofEpochMilli(request.epochMillis))))
            contacts[request.designation] = builder.build()
        }
    }

    private fun mergeContact(mergeContactRequest: Actions.TmaSystemRequest.TmaMergeContactSubrequest) {
        synchronized(lock) {
            val designation = "M$nextMergeDesignationNumber"
            nextMergeDesignationNumber += 1
            val mergedContactBuilder = Updates.TmaSystemUpdate.TmaContact.newBuilder()
                    .setDesignation(designation)
            for (i in 0 until mergeContactRequest.designationsCount) {
                mergedContactBuilder.addAllBearings(
                        contacts[mergeContactRequest.getDesignations(i)]?.bearingsList
                                ?: throw NoSuchContactException("Expected to find contact ${mergeContactRequest.getDesignations(i)}"))
            }
            for (i in 0 until mergeContactRequest.designationsCount) {
                contacts.remove(mergeContactRequest.getDesignations(i))
            }
            contacts[designation] = mergedContactBuilder.build()
        }
    }

    private fun deleteContact(deleteContactRequest: Actions.TmaSystemRequest.TmaDeleteContactSubrequest) {
        synchronized(lock) {
            contacts.remove(deleteContactRequest.designation)
        }
    }

    private fun uploadSolution(uploadSolutionRequest: Actions.TmaSystemRequest.TmaUploadSolutionSubrequest) {
        synchronized(lock) {
            val builder = contacts[uploadSolutionRequest.designation]?.toBuilder()
                    ?: throw NoSuchContactException("Expected contact with name ${uploadSolutionRequest.designation}")
            contacts[uploadSolutionRequest.designation] = builder.setSolution(
                    Updates.TmaSystemUpdate.TmaContact.Solution.newBuilder()
                    .setEpochMillis(Instant.now().toEpochMilli())
                    .setHeadingDegrees(uploadSolutionRequest.solution.headingDegrees)
                    .setPosition(uploadSolutionRequest.solution.position)
                    .setSpeedKnots(uploadSolutionRequest.solution.speedKnots)).build()
        }
    }

    private fun deleteBearing(deleteBearingRequest: Actions.TmaSystemRequest.TmaDeleteBearingSubrequest) {
        synchronized(lock) {
            val contact = contacts[deleteBearingRequest.designation]
                    ?: throw NoSuchContactException("Expected contact with name ${deleteBearingRequest.designation}")
            val bearingToDelete =
                    contact.bearingsList.firstOrNull { it.epochMillis == deleteBearingRequest.epochMillis }
            contacts[deleteBearingRequest.designation] =
                    contact.toBuilder().removeBearings(contact.bearingsList.indexOf(bearingToDelete)).build()
        }
    }
}