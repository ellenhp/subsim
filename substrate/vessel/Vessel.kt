package substrate.vessel

import api.Actions
import api.ScenarioOuterClass
import api.ScenarioOuterClass.VesselDescriptor
import api.Spatial
import api.Updates
import substrate.sonar.SonarClient
import substrate.utils.Utils
import java.lang.Math.toDegrees
import java.time.Duration
import java.time.Instant

class Vessel(val uniqueId: String,
             val vesselDescriptor: VesselDescriptor,
             val spawnInfo: ScenarioOuterClass.SpawnedVessel.SpawnInformation,
             val sonarClient: SonarClient,
             val simWorldInterface: SimWorldInterface) {

    var position: Spatial.Position = if (spawnInfo.hasPosition()) spawnInfo.position else randomPositionWithinBounds(spawnInfo.bounds)
    val systems: List<VesselSystem> = vesselDescriptor.systemsList.map(this::initializeSystem)
    val positionBuffer = PositionBuffer(Duration.ofMinutes(10))
    var heading: Double = if (spawnInfo.hasHeadingBounds()) randomHeadingWithinBounds(spawnInfo.headingBounds) else spawnInfo.exactSpawnHeading.toDouble()
    var noiseLevel = 0.0
    private var lastPositionStoredInstant = Instant.now()
    private var isDead = false
    private var explosionNoise: Double = 0.0

    init {
        systems.forEach { it.setupInitialState(spawnInfo) }
    }

    override fun equals(other: Any?): Boolean {
        if (super.equals(other)) {
            return true
        }
        if (other === null) {
            return false
        }
        if (other is Vessel) {
            return other.uniqueId == uniqueId
        }
        return false
    }

    override fun hashCode(): Int {
        return uniqueId.hashCode()
    }

    fun step(dt: Duration, explosionNoise: Double) {
        this.explosionNoise = explosionNoise
        if (isDead)
            return
        // If a system kills the vessel, we want to IMMEDIATELY stop processing other systems, because we don't want
        // state mutated post-death, e.g. by the propulsion system, setting noiseLevel to be non-zero.
        systems.forEach {
            if (!isDead) {
                it.step(dt)
            }
        }
        if (Duration.between(lastPositionStoredInstant, Instant.now()).abs().seconds > 5) {
            // Add the position to the buffer for later use.
            positionBuffer.addPosition(position)
            lastPositionStoredInstant = Instant.now()
        }
    }

    fun getUpdate(): Updates.VesselUpdate {
        val updateBuilder = Updates.VesselUpdate.newBuilder()
        systems.forEach { updateBuilder.addSystemUpdates(it.getSystemUpdate()) }
        updateBuilder.position = position
        updateBuilder.isDead = isDead
        updateBuilder.explosionNoise = explosionNoise.toFloat()
        return updateBuilder.build()
    }

    fun processAction(action: Actions.DoActionRequest) {
        action.systemRequestsList.forEach { processSystemRequest(it) }
    }

    fun processSonarContact(propagationResult: SonarSystem.PropagationResult) {
        maybeGetSystem<SonarSystem>()?.let {
            it.updateContact(propagationResult.otherContact, propagationResult)
        }
    }

    fun kill() {
        println("$uniqueId died")
        isDead = true
    }

    fun isAlive(): Boolean {
        return !isDead
    }

    fun bearingToDegrees(otherPosition: Spatial.Position): Double {
        return (toDegrees(Utils.calculateBearingRadians(position, otherPosition)) + 360) % 360
    }

    fun distanceToFeet(otherPosition: Spatial.Position): Double {
        return Utils.toFeet(Utils.distanceMeters(position, otherPosition)).toDouble()
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
            request.hasTmaRequest() -> getSystem<TmaSystem>().processRequest(request)
            request.hasWeaponRequest() -> getSystem<WeaponSystem>().processRequest(request)
        }
    }

    private fun initializeSystem(systemDescriptor: api.Systems.VesselSystem): VesselSystem {
        val system : VesselSystem = when {
            systemDescriptor.hasDivingSystem() -> DivingSystem(this, systemDescriptor.divingSystem)
            systemDescriptor.hasSteeringSystem() -> SteeringSystem(this, systemDescriptor.steeringSystem)
            systemDescriptor.hasPropulsionSystem() -> PropulsionSystem(this, systemDescriptor.propulsionSystem)
            systemDescriptor.hasMapSystem() -> MapSystem(this)
            systemDescriptor.hasHullSystem() -> HullSystem(this, systemDescriptor.hullSystem)
            systemDescriptor.hasSonarSystem() -> SonarSystem(this, systemDescriptor.sonarSystem)
            systemDescriptor.hasTmaSystem() -> TmaSystem(this, systemDescriptor.tmaSystem)
            systemDescriptor.hasWeaponSystem() -> WeaponSystem(this, systemDescriptor.weaponSystem)
            systemDescriptor.hasSelfDestructSystem() -> SelfDestructSystem(this, systemDescriptor.selfDestructSystem)
            systemDescriptor.hasGuidanceSystem() -> GuidanceSystem(this, systemDescriptor.guidanceSystem)
            else -> throw VesselInstantiationException("No matching system for vessel descriptor ${vesselDescriptor.uniqueId}. Upgrade the server?")
        }
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

interface SimWorldInterface {
    fun spawnVessel(vesselDescriptor: String, spawnInfo: ScenarioOuterClass.SpawnedVessel.SpawnInformation): Vessel
    fun getAllVessels(): List<Vessel>
    fun setExplosionNoise(noise: Double)
}