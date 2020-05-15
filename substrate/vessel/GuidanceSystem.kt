package substrate.vessel

import api.*
import substrate.utils.Utils
import java.time.Duration

class GuidanceSystem(vessel: Vessel, val descriptor: Systems.GuidanceSystem) : VesselSystem(vessel) {

    var guidanceType = Actions.WeaponSystemRequest.FireWeaponRequest.GuidanceMode.NONE
    var enableDistanceFeet = Int.MAX_VALUE
    private val initialPosition = vessel.position
    private var enabled = false
    private var last

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().build()
    }

    override fun step(dt: Duration) {
        if (!enabled && Utils.toFeet(Utils.distanceMeters(initialPosition, vessel.position)) > enableDistanceFeet) {
            enabled = true
        }
        if (!enabled) {
            return
        }
        val contacts = vessel.getSystem<SonarSystem>().contacts

    }
}