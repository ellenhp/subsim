package substrate.vessel

import api.Systems
import api.Updates
import substrate.utils.Utils
import java.time.Duration
import java.time.Instant

class SelfDestructSystem(vessel: Vessel, val descriptor: Systems.SelfDestructSystem) : VesselSystem(vessel) {
    val startTime = Instant.now()

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().build()
    }

    override fun step(dt: Duration) {
        maybeBlowUp()
    }

    private fun maybeRunDownTimer() {
        if (descriptor.selfDestructTimerSeconds > 0 &&
                Instant.now().isAfter(startTime.plusSeconds(descriptor.selfDestructTimerSeconds.toLong()))) {
            vessel.noiseLevel = 0.0
            vessel.kill()
        }
    }

    private fun maybeBlowUp() {
        if (descriptor.triggerRadiusFeet > 0) {
            val triggeringVessels = vessel.simWorldInterface.getAllVessels().filter {
                vessel.distanceToFeet(it.position) < descriptor.triggerRadiusFeet
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