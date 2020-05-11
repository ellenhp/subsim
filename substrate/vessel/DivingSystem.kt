package substrate.vessel

import api.Systems
import api.Updates
import java.time.temporal.ChronoUnit.*
import java.time.temporal.TemporalAmount
import kotlin.math.abs
import kotlin.math.sign

class DivingSystem(vessel: Vessel, val descriptor: Systems.DivingSystem) : VesselSystem(vessel) {
    private var requestedDepthFeet = 0.0

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder()
                .setDivingUpdate(Updates.DivingSystemUpdate.newBuilder().setRequestedDepthFeet(requestedDepthFeet))
                .build()
    }

    override fun step(dt: TemporalAmount) {
        val actualDepthFeet = vessel.getSystem<HullSystem>().actualDepthFeet
        val delta = requestedDepthFeet - actualDepthFeet
        val maxDeltaThisStepFeet = abs(dt.get(SECONDS) * descriptor.feetPerSecond)

        // If we can get to the requested depth in this step, great.
        if (abs(delta) <= maxDeltaThisStepFeet) {
            vessel.getSystem<HullSystem>().actualDepthFeet = requestedDepthFeet
        } else {
            vessel.getSystem<HullSystem>().actualDepthFeet += sign(delta) * maxDeltaThisStepFeet
        }
    }
}