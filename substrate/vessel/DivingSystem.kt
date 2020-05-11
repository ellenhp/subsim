package substrate.vessel

import api.Actions
import api.Systems
import api.Updates
import java.time.Duration
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

    override fun processRequest(request: Actions.SystemRequest) {
        requestedDepthFeet = request.divingRequest.depthFeet.toDouble()
    }

    override fun step(dt: Duration) {
        val dtSeconds = dt.toNanos().toDouble() / Duration.ofSeconds(1).toNanos()
        val actualDepthFeet = vessel.getSystem<HullSystem>().actualDepthFeet
        val delta = requestedDepthFeet - actualDepthFeet
        val maxDeltaThisStepFeet = abs(dtSeconds * descriptor.feetPerSecond)

        // If we can get to the requested depth in this step, great.
        if (abs(delta) <= maxDeltaThisStepFeet) {
            vessel.getSystem<HullSystem>().actualDepthFeet = requestedDepthFeet
        } else {
            vessel.getSystem<HullSystem>().actualDepthFeet += sign(delta) * maxDeltaThisStepFeet
        }
    }
}