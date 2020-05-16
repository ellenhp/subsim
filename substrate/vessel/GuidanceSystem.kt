package substrate.vessel

import api.*
import substrate.utils.Utils
import java.time.Duration
import java.time.Instant
import kotlin.math.roundToInt

class GuidanceSystem(vessel: Vessel, val descriptor: Systems.GuidanceSystem) : VesselSystem(vessel) {

    var guidanceType = Actions.WeaponSystemRequest.FireWeaponRequest.GuidanceMode.NONE
    var enableDistanceFeet = Int.MAX_VALUE
    private val initialPosition = vessel.position
    private var enabled = false
    private var lastPing = Instant.now()

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

        if (lastPing.isBefore(Instant.now().minusSeconds(7))) {
            lastPing = Instant.now()
            val contacts = vessel.getSystem<SonarSystem>().contacts
            val sortedContacts = contacts.map { Pair(
                    it.value / (45 + vessel.bearingToDegrees(it.key.position)),
                    it.key
            )}.sortedByDescending { it.first }

            sortedContacts.firstOrNull()?.let {
                vessel.getSystem<SteeringSystem>().requestedHeadingDegrees =
                        vessel.bearingToDegrees(it.second.position).roundToInt()
            }
        }
    }
}