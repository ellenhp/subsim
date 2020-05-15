package substrate.vessel

import api.Updates

class MapSystem(vessel: Vessel) : VesselSystem(vessel) {
    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().build()
    }

}