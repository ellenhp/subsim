package substrate.vessel

import api.Actions
import api.ScenarioOuterClass
import api.Systems
import api.Updates
import java.time.Duration
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
        if (request.steeringRequest.headingDegrees in 0..359) {
            requestedHeadingDegrees = request.steeringRequest.headingDegrees
        }
    }

    override fun setupInitialState(spawnInfo: ScenarioOuterClass.SpawnedVessel.SpawnInformation) {
        requestedHeadingDegrees = vessel.heading.roundToInt()
    }

    override fun step(dt: Duration) {
        var delta: Double = requestedHeadingDegrees - vessel.heading
        // Deltas are easier to reason about when they're positive (for me, a dumdum).
        delta = (delta + 360) % 360
        // If it seems like we should turn >180 degrees, we should be turning in the opposite direction!
        if (delta > 180) {
            delta -= 360
        }

        val dtSeconds = dt.toNanos().toDouble() / Duration.ofSeconds(1).toNanos()
        val maxDeltaThisStep: Double = abs(dtSeconds * descriptor.degreesPerSecond)

        // If we can get to the requested heading in this step, great.
        val newHeading = if (abs(delta) <= maxDeltaThisStep) {
            requestedHeadingDegrees.toDouble()
        } else {
            vessel.heading + sign(delta) * maxDeltaThisStep
        }
        vessel.heading = (newHeading + 360) % 360
    }
}