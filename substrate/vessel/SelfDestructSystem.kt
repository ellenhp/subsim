package substrate.vessel

import api.Systems
import api.Updates
import substrate.utils.Utils
import java.time.Duration
import java.time.Instant

class SelfDestructSystem(vessel: Vessel, val descriptor: Systems.SelfDestructSystem) : VesselSystem(vessel) {
    val startTime = Instant.now()
    var enableDistanceFeet = 0
    val startPosition = vessel.position
    var enabled = false

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().build()
    }

    override fun step(dt: Duration) {
        maybeBlowUp()
        maybeRunDownTimer()
    }

    private fun maybeRunDownTimer() {
        if (descriptor.selfDestructTimerSeconds > 0 &&
                Instant.now().isAfter(startTime.plusSeconds(descriptor.selfDestructTimerSeconds.toLong()))) {
            vessel.noiseLevel = 0.0
            vessel.kill()
        }
    }

    private fun maybeBlowUp() {
        // Allow the weapons system to configure the torpedo.
        if (Duration.between(startTime, Instant.now()).seconds <= 1) {
            return
        }
        if (enableDistanceFeet == 0) {
            enabled = true
        }
        if (vessel.distanceToFeet(startPosition) > enableDistanceFeet) {
            enabled = true
        }
        if (enabled && descriptor.triggerRadiusFeet > 0) {
            val triggeringVessels = vessel.simWorldInterface.getAllVessels().filter {
                vessel.distanceToFeet(it.position) < descriptor.triggerRadiusFeet
            }.filter {
                it.uniqueId != vessel.uniqueId
            }
            if (triggeringVessels.isEmpty()) {
                return
            }
            val unluckyVessels = vessel.simWorldInterface.getAllVessels().filter {
                vessel.distanceToFeet(it.position) < descriptor.triggerRadiusFeet
            }
            unluckyVessels.forEach(Vessel::kill)
            vessel.kill()
        }
    }
}