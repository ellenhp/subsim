package substrate.vessel

import api.Systems
import api.Updates
import substrate.utils.Utils
import java.lang.Math.toDegrees
import java.time.Duration
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap
import kotlin.math.roundToInt

class SonarSystem(vessel: Vessel, private val sonarSystem: Systems.SonarSystem) : VesselSystem(vessel) {

    private val contactNoiseLevels = ConcurrentHashMap<Vessel, Double>()
    private val contactLastSeenTimes = ConcurrentHashMap<Vessel, Instant>()

    override fun getSystemUpdate(): Updates.SystemUpdate {
        val seaFloorDepthFeet = vessel.sonarClient.bathymetry.getDepthFeet(vessel.position.lat, vessel.position.lng)
        return Updates.SystemUpdate.newBuilder()
                .setSonarUpdate(Updates.SonarSystemUpdate.newBuilder()
                        .setDepthBelowKeelFeet((seaFloorDepthFeet - vessel.getSystem<HullSystem>().actualDepthFeet).roundToInt())
                        .addArrayUpdates(Updates.SonarSystemUpdate.SonarArrayUpdate.newBuilder()
                                .addAllContacts(contactNoiseLevels.map {
                                    Updates.SonarSystemUpdate.SonarContact.newBuilder()
                                            .setVesselId(it.key.uniqueId)
                                            .setBearing(toDegrees(Utils.calculateBearingRadians(vessel.position, it.key.position)).toFloat())
                                            .setBroadbandPowerLevel(it.value.toFloat())
                                            .build()
                                })
                )).build()
    }

    override fun step(dt: Duration) {
        val cutoffTime = Instant.now().minusSeconds(30)
        val oldContacts = contactLastSeenTimes.filter { it.value.isBefore(cutoffTime) }
        oldContacts.forEach {
            contactLastSeenTimes.remove(it.key)
            contactNoiseLevels.remove(it.key)
        }
    }

    fun updateContact(vessel: Vessel, noiseLevel: Double) {
        contactLastSeenTimes[vessel] = Instant.now()
        contactNoiseLevels[vessel] = noiseLevel
    }
}