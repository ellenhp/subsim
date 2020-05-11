package substrate.vessel

import api.Actions
import api.ScenarioOuterClass.SpawnedVessel.SpawnInformation
import api.Updates
import java.time.temporal.TemporalAmount

abstract class VesselSystem(val vessel: Vessel) {
    open fun step(dt: TemporalAmount) {}
    open fun processRequest(request: Actions.SystemRequest) {}
    open fun setupInitialState(spawnInfo: SpawnInformation) {}
    abstract fun getSystemUpdate() : Updates.SystemUpdate
}