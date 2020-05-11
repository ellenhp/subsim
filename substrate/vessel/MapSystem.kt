package substrate.vessel

import api.Systems
import api.Updates

class MapSystem(vessel: Vessel, mapSystem: Systems.MapSystem) : VesselSystem(vessel) {
    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().build()
    }

}