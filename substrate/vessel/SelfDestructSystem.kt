package substrate.vessel

import api.Systems
import api.Updates

class SelfDestructSystem(vessel: Vessel, val descriptor: Systems.SelfDestructSystem) : VesselSystem(vessel) {
    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().build()
    }
}