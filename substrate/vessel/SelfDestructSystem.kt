package substrate.vessel

import api.Systems
import api.Updates
import substrate.utils.Utils
import java.time.Duration

class SelfDestructSystem(vessel: Vessel, val descriptor: Systems.SelfDestructSystem) : VesselSystem(vessel) {
    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().build()
    }

    override fun step(dt: Duration) {
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
        // TODO: increase background noise, add messages to chat.
    }
}