package substrate.vessel

import api.ScenarioOuterClass
import api.Systems
import api.Updates
import java.time.Duration
import kotlin.math.max

class HullSystem(vessel: Vessel, val descriptor: Systems.HullSystem) : VesselSystem(vessel) {
    val draftFeet = descriptor.draftFeet.toDouble()
    var actualDepthFeet = draftFeet.toDouble()
    val sonarReturn = descriptor.sonarReturn.toDouble()

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().setHullUpdate(Updates.HullSystemUpdate.newBuilder().setActualDepthFeet(actualDepthFeet)).build()
    }

    override fun step(dt: Duration) {
        val seaFloorDepth = vessel.sonarClient.bathymetry.getDepthFeet(vessel.position.lat, vessel.position.lng)
        if (seaFloorDepth < max(draftFeet, actualDepthFeet)) {
            vessel.kill()
        }
    }
}