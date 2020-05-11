package substrate.vessel

import api.Actions
import api.Systems
import api.Updates
import java.time.Duration
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAmount
import kotlin.math.abs
import kotlin.math.roundToInt
import kotlin.math.sign

class SteeringSystem(vessel: Vessel, val descriptor: Systems.SteeringSystem) : VesselSystem(vessel) {
    private var requestedHeadingDegrees = 0

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().setSteeringUpdate(Updates.SteeringSystemUpdate
                .newBuilder()
                .setActualHeadingDegrees(vessel.heading.roundToInt())
                .setRequestedHeadingDegrees(requestedHeadingDegrees))
                .build()
    }

    override fun processRequest(request: Actions.SystemRequest) {
        requestedHeadingDegrees = request.steeringRequest.headingDegrees
    }

    override fun step(dt: Duration) {
        var delta: Double = requestedHeadingDegrees - vessel.heading
        // If it seems like we should turn >180 degrees, we should be turning in the opposite direction!
        if (delta > 180) {
            delta -= 360
        }
        val dtSeconds = dt.toNanos().toDouble() / Duration.ofSeconds(1).toNanos()
        val maxDeltaThisStep: Double = abs(dtSeconds * descriptor.degreesPerSecond)

        // If we can get to the requested heading in this step, great.
        if (abs(delta) <= maxDeltaThisStep) {
            vessel.heading = requestedHeadingDegrees.toDouble()
        } else {
            vessel.heading += sign(delta) * maxDeltaThisStep
        }
    }
}