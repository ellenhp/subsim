package substrate.vessel

import api.Systems
import api.Updates
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAmount
import kotlin.math.abs
import kotlin.math.roundToInt
import kotlin.math.sign

class SteeringSystem(vessel: Vessel, val descriptor: Systems.SteeringSystem) : VesselSystem(vessel) {
    private var actualHeadingDegrees = 0.0
    private var requestedHeadingDegrees = 0

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().setSteeringUpdate(Updates.SteeringSystemUpdate
                .newBuilder()
                .setActualHeadingDegrees(actualHeadingDegrees.roundToInt())
                .setRequestedHeadingDegrees(requestedHeadingDegrees))
                .build()
    }

    override fun step(dt: TemporalAmount) {
        var delta: Double = requestedHeadingDegrees - actualHeadingDegrees
        // If it seems like we should turn >180 degrees, we should be turning in the opposite direction!
        if (delta > 180) {
            delta = 180 - delta
        }
        val maxDeltaThisStep: Double = abs(dt.get(ChronoUnit.SECONDS) * descriptor.degreesPerSecond)

        // If we can get to the requested heading in this step, great.
        if (abs(delta) <= maxDeltaThisStep) {
            actualHeadingDegrees = requestedHeadingDegrees.toDouble()
        } else {
            actualHeadingDegrees += sign(delta) * maltaThisStep
        }
    }
}