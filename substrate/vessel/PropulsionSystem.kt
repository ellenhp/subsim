package substrate.vessel

import api.ScenarioOuterClass
import api.Spatial
import api.Systems
import api.Updates
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalAmount
import kotlin.math.*

class PropulsionSystem(vessel: Vessel, val descriptor: Systems.PropulsionSystem) : VesselSystem(vessel) {
    private var requestedSpeedKnots = 0.0
    private var actualSpeedKnots = 0.0

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().setPropulsionUpdate(Updates.PropulsionSystemUpdate.newBuilder()
                .setActualSpeedKnots(actualSpeedKnots.roundToInt())
                .setRequestedSpeedKnots(requestedSpeedKnots.roundToInt())).build()
    }

    override fun step(dt: TemporalAmount) {
        updateSpeed(dt)
        updatePosition(dt)
    }

    private fun updateSpeed(dt: TemporalAmount) {
        val delta = requestedSpeedKnots - actualSpeedKnots
        val maxDeltaThisStepKnots = abs(dt.get(ChronoUnit.SECONDS) * descriptor.knotsPerSecond)

        // If we can get to the requested speed in this step, great.
        if (abs(delta) <= maxDeltaThisStepKnots) {
            actualSpeedKnots = requestedSpeedKnots
        } else {
            actualSpeedKnots += sign(delta) * maxDeltaThisStepKnots
        }
    }

    private fun updatePosition(dt: TemporalAmount) {
        val position = vessel.position
        // We'll need this later, compute it now for clarity :)
        val absoluteLatitudeRadians = position.lat / 180 * Math.PI

        // Determine the components of the velocity in a locally cartesian X-Y
        // grid, in knots.
        val headingRadians = vessel.heading / 180 * Math.PI
        // A heading of zero is due north, so we need to use sin for X and cos for Y.
        val xKnots = actualSpeedKnots * sin(headingRadians)
        val yKnots = actualSpeedKnots * cos(headingRadians)

        @Suppress("UnnecessaryVariable")
        // One knot is 1 nmi / hr, which approximates to one minute of latitude / hr.
        val latMinutesPerHour = yKnots;
        // Longitudinal speed depends on our absolute latitude.
        val lngMinutesPerHour = xKnots / cos(absoluteLatitudeRadians)

        val newPosition = Spatial.Position.newBuilder()
                .setLat(position.lat + dt.get(ChronoUnit.HOURS) * latMinutesPerHour)
                .setLng(position.lng + dt.get(ChronoUnit.HOURS) * lngMinutesPerHour)
                .build()

        vessel.position = newPosition
    }
}