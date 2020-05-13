package substrate.vessel

import api.Actions
import api.ScenarioOuterClass
import api.ScenarioOuterClass.VesselDescriptor
import api.Spatial
import api.Updates
import java.time.Duration
import java.time.temporal.TemporalAmount

class Vessel(val uniqueId: String,
             val vesselDescriptor: VesselDescriptor,
             val spawnInfo: ScenarioOuterClass.SpawnedVessel.SpawnInformation) {

    val systems : List<VesselSystem> = vesselDescriptor.systemsList.map(this::initializeSystem)
    var position: Spatial.Position = if (spawnInfo.hasPosition()) spawnInfo.position else randomPositionWithinBounds(spawnInfo.bounds)
    var heading: Double = if (spawnInfo.hasHeadingBounds()) randomHeadingWithinBounds(spawnInfo.headingBounds) else spawnInfo.exactSpawnHeading.toDouble()
    var noiseLevel = 0.0

    fun step(dt: Duration) {
        systems.forEach { it.step(dt) }
    }

    fun getUpdate(): Updates.VesselUpdate {
        val updateBuilder = Updates.VesselUpdate.newBuilder()
        systems.forEach { updateBuilder.addSystemUpdates(it.getSystemUpdate()) }
        updateBuilder.position = position
        return updateBuilder.build()
    }

    fun processAction(action: Actions.DoActionRequest) {
        action.systemRequestsList.forEach { processSystemRequest(it) }
    }

    fun processSonarContact(otherContact: Vessel, powerLevel: Double) {
        println("$uniqueId heard ${otherContact.uniqueId} at power level $powerLevel")
        maybeGetSystem<SonarSystem>()?.let {
            it.updateContact(otherContact, powerLevel)
        }
    }

    inline fun <reified T : VesselSystem> getSystem() : T {
        val matchingSystems = systems.filterIsInstance<T>()
        if (matchingSystems.size != 1) {
            throw SystemMatchingException(
                    "Vessel $uniqueId expected exactly one system of type ${T::class.java.name} but found ${matchingSystems.size}. " +
                            "Check the scenario proto for errors")
        }
        return matchingSystems[0]
    }

    inline fun <reified T : VesselSystem> maybeGetSystem() : T? {
        val matchingSystems = systems.filterIsInstance<T>()
        if (matchingSystems.size > 1) {
            throw SystemMatchingException(
                    "Vessel $uniqueId expected 0 or 1 systems of type ${T::class.java.name} but found ${matchingSystems.size}. " +
                            "Check the scenario proto for errors")
        }
        if (matchingSystems.isEmpty()) {
            return null;
        }
        return matchingSystems[0]
    }

    private fun processSystemRequest(request: Actions.SystemRequest) {
        when {
            request.hasDivingRequest() -> getSystem<DivingSystem>().processRequest(request)
            request.hasMapRequest() -> getSystem<MapSystem>().processRequest(request)
            request.hasPropulsionRequest() -> getSystem<PropulsionSystem>().processRequest(request)
            request.hasSteeringRequest() -> getSystem<SteeringSystem>().processRequest(request)
        }
    }

    private fun initializeSystem(systemDescriptor: api.Systems.VesselSystem): VesselSystem {
        val system : VesselSystem = when {
            systemDescriptor.hasDivingSystem() -> DivingSystem(this, systemDescriptor.divingSystem)
            systemDescriptor.hasSteeringSystem() -> SteeringSystem(this, systemDescriptor.steeringSystem)
            systemDescriptor.hasPropulsionSystem() -> PropulsionSystem(this, systemDescriptor.propulsionSystem)
            systemDescriptor.hasMapSystem() -> MapSystem(this, systemDescriptor.mapSystem)
            systemDescriptor.hasHullSystem() -> HullSystem(this, systemDescriptor.hullSystem)
            systemDescriptor.hasSonarSystem() -> SonarSystem(this, systemDescriptor.sonarSystem)
            else -> throw VesselInstantiationException("No matching system for vessel descriptor ${vesselDescriptor.uniqueId}. Upgrade the server?")
        }
        system.setupInitialState(spawnInfo)
        return system
    }

    private fun randomPositionWithinBounds(bounds: Spatial.Bounds): Spatial.Position {
        return Spatial.Position.newBuilder()
                .setLat(bounds.southWest.lat + Math.random() * (bounds.northEast.lat - bounds.southWest.lat))
                .setLng(bounds.southWest.lng + Math.random() * (bounds.northEast.lng - bounds.southWest.lng))
                .build()
    }

    private fun randomHeadingWithinBounds(bounds: Spatial.HeadingBounds): Double {
        return (bounds.leftBound + Math.random() * (bounds.rightBound - bounds.leftBound)) % 360
    }
}