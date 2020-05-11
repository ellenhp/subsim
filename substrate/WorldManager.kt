package substrate

import api.Actions
import api.ScenarioOuterClass
import api.Updates
import java.time.Duration
import java.time.Instant
import java.time.temporal.TemporalAmount
import java.util.concurrent.ConcurrentHashMap

class WorldManager {

    val worlds = ConcurrentHashMap<String, SimWorld>()
    val lastAccessTimes = ConcurrentHashMap<String, Instant>()

    fun maybeAdd(worldId: String, scenario: ScenarioOuterClass.Scenario) {
        worlds.getOrPut(worldId, { SimWorld(scenario) })
        lastAccessTimes[worldId] = Instant.now()
    }

    fun processAction(action: Actions.DoActionRequest) {
        val world = worlds[action.scenarioId]
        if (world !== null) {
            lastAccessTimes[action.scenarioId] = Instant.now()
            world.processAction(action)
        } else {
            throw NoSuchWorldException("World with id ${action.scenarioId} does not exist")
        }
    }

    fun getUpdate(worldId: String, vesselId: String): Updates.VesselUpdate {
        val world = worlds[worldId]
        if (world === null) {
            throw NoSuchWorldException("No world with id $worldId")
        }
        return world.getUpdateForVessel(vesselId)
    }

    fun stepAll(dt: Duration) {
        val cutoffTime = Instant.now().minus(Duration.ofHours(6))
        worlds.keys.filter { lastAccessTimes[it]?.isBefore(cutoffTime) == true }.forEach { worlds.remove(it) }
        worlds.values.forEach { it.step(dt) }
    }
}