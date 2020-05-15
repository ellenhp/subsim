package substrate.sonar

import BloopGrpc
import BloopOuterClass
import api.Spatial
import io.grpc.stub.StreamObserver
import substrate.utils.Utils
import substrate.utils.Utils.Companion.distanceMeters
import substrate.utils.Utils.Companion.toMeters
import java.lang.Math.toRadians
import kotlin.math.*


class SonarClient(val stub: BloopGrpc.BloopStub, val bathymetry: Bathymetry) {
    
    fun propagate(from: Spatial.Position, to: Spatial.Position, fromDepthFeet: Double, toDepthFeet: Double, lossHandler: (Float) -> Unit) {
        val distance = distanceMeters(from, to)
        // Pad the distance by 100m because bellhop likes having information beyond the endpoints.
        val bathymetricProfile = bathymetricProfile(distance + 100, from, to)

        val request = BloopOuterClass.PropagateRequest.newBuilder()
                .setBathymetry(bathymetricProfile)
                .addDepths(toMeters(toDepthFeet))
                .addRanges(distance.toFloat())
                .setSourceDepth(toMeters(fromDepthFeet))
                .setFrequency(200)
                .setSsp(soundSpeedProfile())
                .build()
        stub.propagate(request, object: StreamObserver<BloopOuterClass.PropagateResponse> {
            override fun onNext(response: BloopOuterClass.PropagateResponse) {
                lossHandler(response.loss.getPoints(0).loss)
            }

            override fun onError(t: Throwable) {
                println("error from bloop!")
                t.printStackTrace()
            }

            override fun onCompleted() {}

        })
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

    private fun bathymetricProfile(distance: Double, from: Spatial.Position, to: Spatial.Position): BloopOuterClass.BathymetricProfile? {
        val bathymetryResolutionNominal = 200.0
        val numDepthPoints = 1 + (distance / bathymetryResolutionNominal).roundToInt()
        val bathymetryResolutionActual = distance / numDepthPoints

        val bathymetryBuilder = BloopOuterClass.BathymetricProfile.newBuilder()
        var currentPos = from
        var currentRange = 0.0

        val deltaLatPerPoint = (to.lat - from.lat) / numDepthPoints
        val deltaLngPerPoint = (to.lng - from.lng) / numDepthPoints

        // Bloop needs this for some reason, sometimes.
        bathymetryBuilder.addPoints(BloopOuterClass.BathymetricProfile.BathymetricProfilePoint.newBuilder()
                .setRangeMeters(-1.0)
                .setDepthMeters(bathymetry.getDepthMeters(currentPos.lat, currentPos.lng).toDouble()))

        for (i in 1..(numDepthPoints + 1)) {
            val position = Spatial.Position.newBuilder().setLat(from.lat + deltaLatPerPoint * i)
            bathymetryBuilder.addPoints(
                    BloopOuterClass.BathymetricProfile.BathymetricProfilePoint.newBuilder()
                            .setRangeMeters(currentRange)
                            .setDepthMeters(bathymetry.getDepthMeters(
                                    from.lat + deltaLatPerPoint * i,
                                    from.lng + deltaLngPerPoint * i).toDouble()))
            currentRange += bathymetryResolutionActual
        }
        return bathymetryBuilder.build()
    }
}
