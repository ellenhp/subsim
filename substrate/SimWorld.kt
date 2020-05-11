package substrate

import api.Actions
import api.ScenarioOuterClass
import api.Updates
import substrate.vessel.Vessel
import substrate.vessel.VesselInstantiationException
import java.time.Duration
import java.time.temporal.TemporalAmount

class SimWorld(val scenario: ScenarioOuterClass.Scenario) {
    private val vesselTypes : Map<String, ScenarioOuterClass.VesselDescriptor> = scenario.vesselDescriptorsList.map { it.uniqueId to it }.toMap()
    val vessels: MutableList<Vessel>

    init {
        vessels = scenario.vesselsList.map {
            val descriptor: ScenarioOuterClass.VesselDescriptor? = vesselTypes[it.vesselDescriptorId]
            if (descriptor === null) {
                throw VesselInstantiationException("Vessel descriptor ${it.vesselDescriptorId} not defined in scenario")
            }
            Vessel(it.uniqueId, descriptor, it.spawnInfo)
        }.toMutableList()
    }

    fun step(dt: Duration) {
        vessels.forEach { it.step(dt) }
    }

    fun getUpdateForVessel(vesselId: String): Updates.VesselUpdate {
        return getMatchingVessel(vesselId).getUpdate()
    }

    fun processAction(action: Actions.DoActionRequest) {
        getMatchingVessel(action.vesselId).processAction(action)
    }

    fun getMatchingVessel(vesselId: String): Vessel {
        val matchingVessels = vessels.filter { it.uniqueId == vesselId }
        if (matchingVessels.size != 1) {
            throw VesselMatchingException("Expected to find exactly one vessel with id $vesselId, but found ${matchingVessels.size}")
        }
        return matchingVessels[0]
    }
}