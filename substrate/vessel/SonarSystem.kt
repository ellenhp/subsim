package substrate.vessel

import api.Spatial
import api.Systems
import api.Updates
import substrate.utils.Utils
import java.lang.Math.toDegrees
import java.time.Duration
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap
import kotlin.math.abs
import kotlin.math.roundToInt

class SonarSystem(vessel: Vessel, private val sonarSystem: Systems.SonarSystem) : VesselSystem(vessel) {

    private val propagationResults = ConcurrentHashMap<Vessel, PropagationResult>()
    private val contactLastSeenTimes = ConcurrentHashMap<Vessel, Instant>()

    val contacts: Map<Vessel, PropagationResult>
        get() {
            return propagationResults.toMap()
        }

    override fun getSystemUpdate(): Updates.SystemUpdate {
        val seaFloorDepthFeet = vessel.sonarClient.bathymetry.getDepthFeet(vessel.position.lat, vessel.position.lng)
        return Updates.SystemUpdate.newBuilder()
                .setSonarUpdate(Updates.SonarSystemUpdate.newBuilder()
                        .setDepthBelowKeelFeet((seaFloorDepthFeet - vessel.getSystem<HullSystem>().actualDepthFeet).roundToInt())
                        .addArrayUpdates(Updates.SonarSystemUpdate.SonarArrayUpdate.newBuilder()
                                .addAllContacts(propagationResults.map {
                                    Updates.SonarSystemUpdate.SonarContact.newBuilder()
                                            .setVesselId(it.key.uniqueId)
                                            .setBearing(toDegrees(Utils.calculateBearingRadians(vessel.position, it.key.position)).toFloat())
                                            .setBroadbandPowerLevel(it.value.getPropagationValues(vessel.position).contactNoiseLevel.toFloat())
                                            .build()
                                })
                )).build()
    }

    override fun step(dt: Duration) {
        val cutoffTime = Instant.now().minusSeconds(30)
        val oldContacts = contactLastSeenTimes.filter { it.value.isBefore(cutoffTime) }
        oldContacts.forEach {
            contactLastSeenTimes.remove(it.key)
            propagationResults.remove(it.key)
        }
    }

    fun updateContact(vessel: Vessel, propagationResult: PropagationResult) {
        contactLastSeenTimes[vessel] = Instant.now()
        propagationResults[vessel] = propagationResult
    }

    class PropagationResult(val otherContact: Vessel, private val distanceFeetToPropagationValues: List<Pair<Int, PropagationValues>>) {
        fun getPropagationValues(myPosition: Spatial.Position): PropagationValues {
            val rangeFeet = otherContact.distanceToFeet(myPosition)
            if (distanceFeetToPropagationValues.isEmpty()) {
                return PropagationValues(0.0, 0.0);
            }
            var bestMatch = distanceFeetToPropagationValues[0]
            for (pair in distanceFeetToPropagationValues) {
                if (abs(pair.first - rangeFeet) < abs(bestMatch.first - rangeFeet)) {
                    bestMatch = pair
                }
            }
            return bestMatch.second
        }
    }
    data class PropagationValues(val contactNoiseLevel: Double, val activeReturn: Double)
}