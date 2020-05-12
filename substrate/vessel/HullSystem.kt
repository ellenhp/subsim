package substrate.vessel

import api.Systems
import api.Updates

class HullSystem(vessel: Vessel, hullSystem: Systems.HullSystem) : VesselSystem(vessel) {
    var actualDepthFeet = 0.0
    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().setHullUpdate(Updates.HullSystemUpdate.newBuilder().setActualDepthFeet(actualDepthFeet)).build()
    }
}