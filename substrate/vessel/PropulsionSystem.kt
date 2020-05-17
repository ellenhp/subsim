package substrate.vessel

import api.*
import substrate.utils.Utils.Companion.stepPosition
import java.time.Duration
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAmount
import kotlin.math.*

class PropulsionSystem(vessel: Vessel, val descriptor: Systems.PropulsionSystem) : VesselSystem(vessel) {
    var requestedSpeedKnots = 0.0
    private var actualSpeedKnots = 0.0
    val maxSpeedKnots = descriptor.maxSpeedKnots.toDouble()

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().setPropulsionUpdate(Updates.PropulsionSystemUpdate.newBuilder()
                .setActualSpeedKnots(actualSpeedKnots.roundToInt())
                .setRequestedSpeedKnots(requestedSpeedKnots.roundToInt())).build()
    }

    override fun processRequest(request: Actions.SystemRequest) {
        if (request.propulsionRequest.speedKnots in 0..descriptor.maxSpeedKnots) {
            requestedSpeedKnots = request.propulsionRequest.speedKnots.toDouble()
        }
    }
    override fun step(dt: Duration) {
        updateSpeed(dt)
        updatePosition(dt)
        updateNoise()
    }

    private fun updateSpeed(dt: Duration) {
        val delta = requestedSpeedKnots - actualSpeedKnots
        val dtSeconds = dt.toNanos().toDouble() / Duration.ofSeconds(1).toNanos()
        val maxDeltaThisStepKnots = abs(dtSeconds * descriptor.knotsPerSecond)

        // If we can get to the requested speed in this step, great.
        if (abs(delta) <= maxDeltaThisStepKnots) {
            actualSpeedKnots = requestedSpeedKnots
        } else {
            actualSpeedKnots += sign(delta) * maxDeltaThisStepKnots
        }
    }

    private fun updatePosition(dt: Duration) {
        val position = vessel.position
        val newPosition = stepPosition(
                position = position,
                speedKnots = actualSpeedKnots,
                heading = vessel.heading,
                dt = dt)


        vessel.position = newPosition
    }

    private fun updateNoise() {
        vessel.noiseLevel = descriptor.baseNoisePower + actualSpeedKnots * descriptor.noisePerKnotNoncavitating
    }
}