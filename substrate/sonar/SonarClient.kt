package substrate.sonar

import BloopGrpc
import BloopOuterClass
import api.Spatial
import java.lang.Math.toRadians
import kotlin.math.*


class SonarClient(val stub: BloopGrpc.BloopBlockingStub, val bathymetry: Bathymetry) {
    
    fun propagateSynchronous(from: Spatial.Position, to: Spatial.Position, fromDepth: Double, toDepth: Double): Float {
        val distance = distanceMeters(from, to)
        val heading = calculateBearingRadians(from, to)
        val bathymetricProfile = bathymetricProfile(distance, from, heading)

        val request = BloopOuterClass.PropagateRequest.newBuilder()
                .setBathymetry(bathymetricProfile)
                .addDepths(toDepth.toFloat())
                .addRanges(distance.toFloat())
                .setFrequency(200)
                .setSsp(soundSpeedProfile())
                .build()
        println(request)
        val response = stub.propagate(request)
        println(response)
        return response.loss.getPoints(0).loss
    }

    private fun soundSpeedProfile(): BloopOuterClass.SoundSpeedProfile? {
        val profileBuilder = BloopOuterClass.SoundSpeedProfile.newBuilder()

        profileBuilder.addSpeedPoints(
                BloopOuterClass.SoundSpeedProfile.SoundSpeedPoint.newBuilder()
                        .setDepthMeters(0)
                        .setSoundSpeed(1500.0)
        )
        profileBuilder.addSpeedPoints(
                BloopOuterClass.SoundSpeedProfile.SoundSpeedPoint.newBuilder()
                        .setDepthMeters(30)
                        .setSoundSpeed(1520.0)
        )
        profileBuilder.addSpeedPoints(
                BloopOuterClass.SoundSpeedProfile.SoundSpeedPoint.newBuilder()
                        .setDepthMeters(60)
                        .setSoundSpeed(1480.0)
        )
        profileBuilder.addSpeedPoints(
                BloopOuterClass.SoundSpeedProfile.SoundSpeedPoint.newBuilder()
                        .setDepthMeters(1000)
                        .setSoundSpeed(1470.0)
        )
        profileBuilder.addSpeedPoints(
                BloopOuterClass.SoundSpeedProfile.SoundSpeedPoint.newBuilder()
                        .setDepthMeters(100000)
                        .setSoundSpeed(1470.0)
        )

        return profileBuilder.build()
    }

    private fun bathymetricProfile(distance: Double, from: Spatial.Position, heading: Double): BloopOuterClass.BathymetricProfile? {
        val bathymetryResolution = 200.0
        val numDepthPoints = 3 + (distance / bathymetryResolution).roundToInt()

        val bathymetryBuilder = BloopOuterClass.BathymetricProfile.newBuilder()
        var currentPos = from
        var currentRange = 0.0

        // Bloop needs this for some reason, sometimes.
        bathymetryBuilder.addPoints(BloopOuterClass.BathymetricProfile.BathymetricProfilePoint.newBuilder()
                .setRangeMeters(-1.0)
                .setDepthMeters(abs(bathymetry.getDepth(currentPos.lat, currentPos.lng).toDouble())))

        for (i in 1..numDepthPoints) {
            bathymetryBuilder.addPoints(
                    BloopOuterClass.BathymetricProfile.BathymetricProfilePoint.newBuilder()
                            .setRangeMeters(currentRange)
                            .setDepthMeters(abs(bathymetry.getDepth(currentPos.lat, currentPos.lng).toDouble())))
            currentRange += bathymetryResolution
            currentPos = stepInDirection(currentPos, heading, bathymetryResolution)
        }
        return bathymetryBuilder.build()
    }

    private fun distanceMeters(pos1: Spatial.Position, pos2: Spatial.Position): Double {
        // Mean radius of the earth
        val radiusMeters = 6_371_008.8
        val distMeters = 2 * radiusMeters *
                asin(sqrt(
                        sin((toRadians(pos2.lat) - toRadians(pos1.lat)) / 2).pow(2.0) +
                                cos(toRadians(pos1.lat)) * cos(toRadians(pos2.lat)) *
                                sin((toRadians(pos2.lng) - toRadians(pos1.lng)) / 2).pow(2.0)
                ))
        return distMeters
    }

    private fun stepInDirection(pos: Spatial.Position, heading: Double, distanceMeters: Double): Spatial.Position {
        // We'll need this later, compute it now for clarity :)
        val absoluteLatitudeRadians = toRadians(pos.lat)

        // Determine the components of the velocity in a locally cartesian X-Y
        // grid, in knots.
        val headingRadians = toRadians(heading)
        // A heading of zero is due north, so we need to use sin for X and cos for Y.
        val xMeters = distanceMeters * sin(headingRadians)
        val yMeters = distanceMeters * cos(headingRadians)

        val metersPerNauticalMile = 1852.0

        @Suppress("UnnecessaryVariable")
        // One nautical mile is approximately one minute of latitude.
        val latMinutes = yMeters / metersPerNauticalMile
        // Longitudinal speed depends on our absolute latitude.
        val lngMinutes = xMeters / metersPerNauticalMile / cos(absoluteLatitudeRadians)

        return Spatial.Position.newBuilder().setLat(pos.lat + latMinutes / 60).setLng(pos.lng + lngMinutes / 60).build()
    }

    private fun calculateBearingRadians(pos1: Spatial.Position, pos2: Spatial.Position): Double {
        val deltaLng = pos2.lng - pos1.lng
        val y = sin(pos2.lng - pos1.lng) * cos(pos2.lat)
        val x = cos(pos1.lat) * sin(pos2.lat) - (sin(pos1.lat)
                * cos(pos2.lat) * cos(pos2.lng - pos1.lng))
        val radiansInCircle = Math.PI * 2
        return (atan2(y, x) + radiansInCircle) % radiansInCircle
    }

}