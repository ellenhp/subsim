package substrate.vessel

import api.ScenarioOuterClass
import api.Systems
import api.Updates
import java.time.Duration
import kotlin.math.max

class HullSystem(vessel: Vessel, val hullSystem: Systems.HullSystem) : VesselSystem(vessel) {
    val draftFeet = hullSystem.draftFeet
    var actualDepthFeet = draftFeet.toDouble()

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().setHullUpdate(Updates.HullSystemUpdate.newBuilder().setActualDepthFeet(actualDepthFeet)).build()
    }

    override fun step(dt: Duration) {
        val seaFloorDepth = vessel.sonarClient.bathymetry.getDepth(vessel.position.lat, vessel.position.lng)
        if (seaFloorDepth < max(hullSystem.draftFeet.toDouble(), actualDepthFeet)) {
            vessel.kill()
        }
    }
}