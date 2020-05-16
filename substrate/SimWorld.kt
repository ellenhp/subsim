package substrate

import api.Actions
import api.ScenarioOuterClass
import api.Updates
import io.grpc.StatusRuntimeException
import substrate.sonar.SonarClient
import substrate.vessel.*
import java.time.Duration
import java.time.Instant
import java.util.*
import kotlin.collections.HashMap
import kotlin.math.roundToInt

class SimWorld(
        scenario: ScenarioOuterClass.Scenario,
        private val sonarClient: SonarClient,
        private val bloopCallFrequencySeconds: Long) : SimWorldInterface {
    private val vesselTypes : Map<String, ScenarioOuterClass.VesselDescriptor> = scenario.vesselDescriptorsList.map { it.uniqueId to it }.toMap()
    private val vessels: MutableList<Vessel>
    private val lastBloopCallTime: MutableMap<Pair<Vessel, Vessel>, Instant> = HashMap()

    init {
        vessels = scenario.vesselsList.map {
            val descriptor: ScenarioOuterClass.VesselDescriptor? = vesselTypes[it.vesselDescriptorId]
            if (descriptor === null) {
                throw VesselInstantiationException("Vessel descriptor ${it.vesselDescriptorId} not defined in scenario")
            }
            Vessel(it.uniqueId, descriptor, it.spawnInfo, sonarClient, this)
        }.toMutableList()
    }

    fun step(dt: Duration) {
        vessels.forEach { it.step(dt) }
        maybeCalculateSonarPropagation()
    }

    private fun maybeCalculateSonarPropagation() {
        val aliveVessels = getAllVessels()
        val pairs = (aliveVessels.indices).map { sourceIdx: Int ->
            (aliveVessels.indices).map { receiveIndex -> Pair(aliveVessels[sourceIdx], aliveVessels[receiveIndex]) }
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

    override fun spawnVessel(vesselDescriptor: String, spawnInfo: ScenarioOuterClass.SpawnedVessel.SpawnInformation): Vessel {
        val vessel = Vessel(
                uniqueId = UUID.randomUUID().toString(),
                vesselDescriptor = vesselTypes[vesselDescriptor]
                        ?: throw VesselInstantiationException("Vessel descriptor $vesselDescriptor not defined in scenario"),
                spawnInfo = spawnInfo,
                sonarClient = sonarClient,
                simWorldInterface = this)
        vessels.add(vessel)
        return vessel
    }

    override fun getAllVessels(): List<Vessel> {
        return vessels.filter(Vessel::isAlive).toList()
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
        if (vesselPair.second.maybeGetSystem<SonarSystem>() === null) {
            // If the second vessel in the pair can't hear, then there's no point calling bloop.
            return
        }

        lastBloopCallTime[vesselPair] = Instant.now()

        val firstDepth = vesselPair.first.maybeGetSystem<HullSystem>()?.actualDepthFeet ?: 1.0
        val secondDepth = vesselPair.second.maybeGetSystem<HullSystem>()?.actualDepthFeet ?: 1.0

        sonarClient.propagate(
                from = vesselPair.first.position,
                to = vesselPair.second.position,
                fromDepthFeet = firstDepth,
                toDepthFeet = secondDepth) {lossList ->
            vesselPair.second.processSonarContact(SonarSystem.PropagationResult(
                    vesselPair.first,
                    lossList.map {
                        Pair(it.first.roundToInt(),
                        SonarSystem.PropagationValues(
                                it.second * vesselPair.first.noiseLevel,
                                vesselPair.first.getSystem<HullSystem>().sonarReturn * it.second * it.second)
                        )
                    }
            ))
        }
    }
}