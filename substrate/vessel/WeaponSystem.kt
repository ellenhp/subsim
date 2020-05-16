package substrate.vessel

import api.*
import java.util.concurrent.ConcurrentHashMap

class WeaponSystem(vessel: Vessel, private val descriptor: Systems.WeaponSystem) : VesselSystem(vessel) {
    private val weapons = descriptor.armamentList.map { it.weapon }
    private val counts = ConcurrentHashMap<Weapons.Weapon, Int>(descriptor.armamentList.map {
        Pair<Weapons.Weapon, Int>(it.weapon, it.count) }.toMap())

    override fun getSystemUpdate(): Updates.SystemUpdate {
        return Updates.SystemUpdate.newBuilder().setWeaponUpdate(Updates.WeaponSystemUpdate.newBuilder()
                .addAllArmament(
                        weapons.map {
                            Weapons.Armament.newBuilder()
                                    .setWeapon(it)
                                    .setCount(counts[it] ?: 0)
                                    .build()
                        }
                )).build()
    }

    override fun processRequest(request: Actions.SystemRequest) {
        when {
            request.weaponRequest.hasFireWeaponRequest() -> fireWeapon(request.weaponRequest.fireWeaponRequest)
        }
    }

    private fun fireWeapon(fireWeaponRequest: Actions.WeaponSystemRequest.FireWeaponRequest) {
        val weapon = vessel.simWorldInterface.spawnVessel(fireWeaponRequest.weapon.weaponVesselDescriptor,
                ScenarioOuterClass.SpawnedVessel.SpawnInformation.newBuilder()
                        .setExactSpawnHeading(0)
                        .setPosition(vessel.position)
                        .build())
        weapon.getSystem<GuidanceSystem>().enableDistanceFeet = fireWeaponRequest.enableDistanceFeet
//        weapon.getSystem<GuidanceSystem>().guidanceType = fireWeaponRequest.
    }
}