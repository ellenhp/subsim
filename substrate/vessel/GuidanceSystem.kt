package substrate.vessel

import api.*
import api.Actions.WeaponSystemRequest.FireWeaponRequest.GuidanceMode.*
import substrate.utils.Utils
import java.time.Duration
import java.time.Instant
import kotlin.math.abs
import kotlin.math.min
import kotlin.math.roundToInt

class GuidanceSystem(vessel: Vessel, val descriptor: Systems.GuidanceSystem) : VesselSystem(vessel) {

    var guidanceType = NONE
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
            val sortedContacts = contacts.map {
                val bearing = vessel.bearingToDegrees(it.key.position)
                val deltaHeading = min(bearing, 360 - bearing)
                Pair(getSonarValueToSortByForMode(it.value) / (15 + deltaHeading), it.key)
            }.sortedByDescending { it.first }

            sortedContacts.firstOrNull()?.let {
                vessel.getSystem<SteeringSystem>().requestedHeadingDegrees =
                        vessel.bearingToDegrees(it.second.position).roundToInt()
            }
        }
    }

    private fun getSonarValueToSortByForMode(propagationResult: SonarSystem.PropagationResult): Double {
        val propagationValues = propagationResult.getPropagationValues(vessel.position)
        return when (guidanceType) {
            UNRECOGNIZED -> 0.0
            GUIDANCE_MODE_UNKNOWN -> 0.0
            NONE -> 0.0
            ACTIVE -> propagationValues.activeReturn
            PASSIVE -> propagationValues.contactNoiseLevel
        }
    }
}