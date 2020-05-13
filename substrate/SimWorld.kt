package substrate

import api.Actions
import api.ScenarioOuterClass
import api.Updates
import io.grpc.StatusRuntimeException
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import substrate.sonar.SonarClient
import substrate.vessel.HullSystem
import substrate.vessel.Vessel
import substrate.vessel.VesselInstantiationException
import java.time.Duration
import java.time.Instant

class SimWorld(
        val uniqueId: String,
        val scenario: ScenarioOuterClass.Scenario,
        val sonarClient: SonarClient,
        private val bloopCallFrequencySeconds: Long) {
    private val vesselTypes : Map<String, ScenarioOuterClass.VesselDescriptor> = scenario.vesselDescriptorsList.map { it.uniqueId to it }.toMap()
    val vessels: MutableList<Vessel>
    val lastBloopCallTime: MutableMap<Pair<Vessel, Vessel>, Instant> = HashMap()

    init {
        vessels = scenario.vesselsList.map {
            val descriptor: ScenarioOuterClass.VesselDescriptor? = vesselTypes[it.vesselDescriptorId]
            if (descriptor === null) {
                throw VesselInstantiationException("Vessel descriptor ${it.vesselDescriptorId} not defined in scenario")
            }
            Vessel(it.uniqueId, descriptor, it.spawnInfo, sonarClient)
        }.toMutableList()
    }

    fun step(dt: Duration) {
        vessels.forEach { it.step(dt) }
        maybeCalculateSonarPropagation()
    }

    fun maybeCalculateSonarPropagation() {
        val pairs = (0 until vessels.size).map { sourceIdx: Int ->
            (0 until vessels.size).map { receiveIndex -> Pair<Vessel, Vessel>(vessels[sourceIdx], vessels[receiveIndex]) }
        }.flatten().filter { it.first !== it.second }

        pairs.forEach {
            try {
                maybeCallBloop(it)
            } catch (ex: StatusRuntimeException) {
                println("error calling bloop")
                ex.printStackTrace()
            }
        }
    }

    fun getUpdateForVessel(vesselId: String): Updates.VesselUpdate {
        return getMatchingVessel(vesselId).getUpdate()
    }

    fun processAction(action: Actions.DoActionRequest) {
        getMatchingVessel(action.vesselId).processAction(action)
    }

    private fun getMatchingVessel(vesselId: String): Vessel {
        val matchingVessels = vessels.filter { it.uniqueId == vesselId }
        if (matchingVessels.size != 1) {
            throw VesselMatchingException("Expected to find exactly one vessel with id $vesselId, but found ${matchingVessels.size}")
        }
        return matchingVessels[0]
    }

    private fun maybeCallBloop(vesselPair: Pair<Vessel, Vessel>) {
        if (lastBloopCallTime[vesselPair]?.isAfter(Instant.now().minusSeconds(bloopCallFrequencySeconds)) == true) {
            // We have called bloop for this pair in the last bloopCallFrequencySeconds.
            return
        }

        lastBloopCallTime[vesselPair] = Instant.now()

        var firstDepth = vesselPair.first.maybeGetSystem<HullSystem>()?.actualDepthFeet ?: 0.0
        var secondDepth = vesselPair.second.maybeGetSystem<HullSystem>()?.actualDepthFeet ?: 0.0

        sonarClient.propagate(vesselPair.first.position, vesselPair.second.position, firstDepth, secondDepth) {
            vesselPair.second.processSonarContact(vesselPair.first, it * vesselPair.first.noiseLevel)
        }
    }
}