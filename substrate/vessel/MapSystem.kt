package substrate.vessel

import api.Systems
import api.Updates
import substrate.utils.Utils.Companion.stepPosition
import java.time.Duration
import java.time.Instant

class MapSystem(vessel: Vessel, mapSystem: Systems.MapSystem) : VesselSystem(vessel) {
    override fun getSystemUpdate(): Updates.SystemUpdate {
        val tmaContacts = vessel.maybeGetSystem<TmaSystem>()?.getContactList() ?: listOf()
        val mapContacts = tmaContacts.filter { it.hasSolution() }.map {
            Updates.MapSystemUpdate.MapContact.newBuilder()
                    .setDesignation(it.designation)
                    .setPosition(
                            stepPosition(
                                    position = it.solution.position,
                                    speedKnots = it.solution.speedKnots.toDouble(),
                                    heading = it.solution.headingDegrees.toDouble(),
                                    dt = Duration.between(Instant.ofEpochMilli(it.solution.epochMillis), Instant.now()))
                    )
                    .setHeadingDegrees(it.solution.headingDegrees)
                    .build()
        }
        return Updates.SystemUpdate.newBuilder().setMapUpdate(
                Updates.MapSystemUpdate.newBuilder().addAllContacts(mapContacts)).build()
    }
}