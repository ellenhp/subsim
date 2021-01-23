import { v4 } from "uuid";

import {
  DoActionRequest,
  DoActionResponse,
} from "../__protogen__/mass/api/actions_pb";
import { ConnectRequest } from "../__protogen__/mass/api/mass_pb";
import { MassBackendClient } from "../__protogen__/mass/api/MassServiceClientPb";
import {
  EndCondition,
  Faction,
  Scenario,
  SpawnedVessel,
  VesselDescriptor,
} from "../__protogen__/mass/api/scenario_pb";
import {
  Bounds,
  HeadingBounds,
  Position,
} from "../__protogen__/mass/api/spatial_pb";
import {
  DivingSystem,
  GuidanceSystem,
  HullSystem,
  MapSystem,
  PropulsionSystem,
  SelfDestructSystem,
  SonarSystem,
  SteeringSystem,
  TmaSystem,
  VesselSystem,
  WeaponSystem,
} from "../__protogen__/mass/api/systems_pb";
import { VesselUpdate } from "../__protogen__/mass/api/updates_pb";
import { Armament, Weapon } from "../__protogen__/mass/api/weapons_pb";
import { Pipe } from "../util/pipe";

function buildNewFeasibleScenario(): Scenario {
  const submarineDescriptorId = "submarine";

  const rebelFaction = new Faction();
  rebelFaction.setPlayerControlled(true);
  rebelFaction.setName("Rebels");

  const blockaderFaction = new Faction();
  blockaderFaction.setPlayerControlled(true);
  blockaderFaction.setName("Blockaders");

  const scenario = new Scenario();
  scenario.addVesselDescriptors(getSubmarineDescriptor(submarineDescriptorId));
  scenario.addVesselDescriptors(getTorpedoDescriptor());
  scenario.addVesselDescriptors(getNoisemakerDescriptor());
  scenario.addVesselDescriptors(getDecoyDescriptor());
  scenario.addVessels(
    getRebelVessel(rebelFaction, submarineDescriptorId, "rebels")
  );
  scenario.addVessels(
    getBlockaderVessel(blockaderFaction, submarineDescriptorId, "blockaders")
  );

  return scenario;
}

function getRebelVessel(
  faction: Faction,
  submarineDescriptorId: string,
  vesselId: string
) {
  const rebelSpawnPosition = new Position();
  rebelSpawnPosition.setLat(47.60724);
  rebelSpawnPosition.setLng(-122.37292);

  const rebelSpawnInfo = new SpawnedVessel.SpawnInformation();
  rebelSpawnInfo.setPosition(rebelSpawnPosition);
  rebelSpawnInfo.setExactSpawnHeading(277);

  const rebelVessel = new SpawnedVessel();
  rebelVessel.setVesselDescriptorId(submarineDescriptorId);
  rebelVessel.setUniqueId(vesselId);
  rebelVessel.setSpawnInfo(rebelSpawnInfo);
  rebelVessel.setFaction(faction);

  return rebelVessel;
}

function getBlockaderVessel(
  faction: Faction,
  submarineDescriptorId: string,
  vesselId: string
) {
  const blockaderPos = new Position();
  blockaderPos.setLat(47.688105);
  blockaderPos.setLng(-122.432214);

  const blockaderSpawnInfo = new SpawnedVessel.SpawnInformation();
  blockaderSpawnInfo.setPosition(blockaderPos);
  blockaderSpawnInfo.setExactSpawnHeading(210);

  const blockaderVessel = new SpawnedVessel();
  blockaderVessel.setVesselDescriptorId(submarineDescriptorId);
  blockaderVessel.setUniqueId(vesselId);
  blockaderVessel.setSpawnInfo(blockaderSpawnInfo);
  blockaderVessel.setFaction(faction);

  return blockaderVessel;
}

function getSubmarineSteeringSystem(): VesselSystem {
  const steering = new SteeringSystem();
  steering.setDegreesPerSecond(8);
  const steeringSystem = new VesselSystem();
  steeringSystem.setSteeringSystem(steering);
  return steeringSystem;
}

function getSubmarineDivingSystem(): VesselSystem {
  const diving = new DivingSystem();
  diving.setFeetPerSecond(3);
  diving.setMaxDepthFeet(1000);
  const divingSystem = new VesselSystem();
  divingSystem.setDivingSystem(diving);
  return divingSystem;
}

function getSubmarineTmaSystem(): VesselSystem {
  const tma = new TmaSystem();
  const tmaSystem = new VesselSystem();
  tmaSystem.setTmaSystem(tma);
  return tmaSystem;
}

function getSubmarinePropulsionSystem(): VesselSystem {
  const propulsion = new PropulsionSystem();
  propulsion.setKnotsPerSecond(2);
  propulsion.setMaxSpeedKnots(33);
  propulsion.setBaseNoisePower(10);
  propulsion.setNoisePerKnotNoncavitating(2);
  const propulsionSystem = new VesselSystem();
  propulsionSystem.setPropulsionSystem(propulsion);
  return propulsionSystem;
}

function getGenericMapSystem(): VesselSystem {
  const map = new MapSystem();
  const mapSystem = new VesselSystem();
  mapSystem.setMapSystem(map);
  return mapSystem;
}

function getSubmarineHullSystem(): VesselSystem {
  const hull = new HullSystem();
  hull.setDraftFeet(31);
  hull.setSonarReturn(1);
  const hullSystem = new VesselSystem();
  hullSystem.setHullSystem(hull);
  return hullSystem;
}

function getSubmarineSonarSystem(): VesselSystem {
  const sonarArray = new SonarSystem.SonarArray();
  sonarArray.setUniqueId("fore");
  sonarArray.setNoiseFloor(0);

  const sonar = new SonarSystem();
  sonar.addSonarArrays(sonarArray);
  const sonarSystem = new VesselSystem();
  sonarSystem.setSonarSystem(sonar);
  return sonarSystem;
}

function getSubmarineWeaponSystem(): VesselSystem {
  const torpoedoVesselDescriptorId = "adcap";
  const noisemakerVesselDescriptorId = "noisemaker";
  const decoyVesselDescriptorId = "decoy";

  const torpedo = new Weapon();
  torpedo.setName("ADCAP");
  torpedo.setType(Weapon.AmmoType.TORPEDO);
  torpedo.setWeaponVesselDescriptor(torpoedoVesselDescriptorId);

  const torpedoArmament = new Armament();
  torpedoArmament.setWeapon(torpedo);
  torpedoArmament.setCount(4);

  const noisemaker = new Weapon();
  noisemaker.setName("Noisemaker");
  noisemaker.setType(Weapon.AmmoType.COUNTERMEASURE);
  noisemaker.setWeaponVesselDescriptor(noisemakerVesselDescriptorId);

  const noisemakerArmament = new Armament();
  noisemakerArmament.setWeapon(noisemaker);
  noisemakerArmament.setCount(4);

  const decoy = new Weapon();
  decoy.setName("Decoy");
  decoy.setType(Weapon.AmmoType.COUNTERMEASURE);
  decoy.setWeaponVesselDescriptor(decoyVesselDescriptorId);

  const decoyArmament = new Armament();
  decoyArmament.setWeapon(decoy);
  decoyArmament.setCount(4);

  const weapon = new WeaponSystem();
  weapon.addArmament(torpedoArmament);
  weapon.addArmament(noisemakerArmament);
  weapon.addArmament(decoyArmament);
  const weaponSystem = new VesselSystem();
  weaponSystem.setWeaponSystem(weapon);
  return weaponSystem;
}

function getSubmarineDescriptor(
  submarineDescriptorId: string
): VesselDescriptor {
  const submarine = new VesselDescriptor();
  submarine.setUniqueId(submarineDescriptorId);
  submarine.setType(2);
  submarine.addSystems(getSubmarineSteeringSystem());
  submarine.addSystems(getSubmarineDivingSystem());
  submarine.addSystems(getSubmarinePropulsionSystem());
  submarine.addSystems(getGenericMapSystem());
  submarine.addSystems(getSubmarineHullSystem());
  submarine.addSystems(getSubmarineSonarSystem());
  submarine.addSystems(getSubmarineTmaSystem());
  submarine.addSystems(getSubmarineWeaponSystem());

  return submarine;
}

function getTorpedoPropulsionSystem(): VesselSystem {
  const propulsion = new PropulsionSystem();
  propulsion.setKnotsPerSecond(4);
  propulsion.setMaxSpeedKnots(55);
  propulsion.setBaseNoisePower(10);
  propulsion.setNoisePerKnotNoncavitating(2);
  const propulsionSystem = new VesselSystem();
  propulsionSystem.setPropulsionSystem(propulsion);
  return propulsionSystem;
}

function getTorpedoSteeringSystem(): VesselSystem {
  const steering = new SteeringSystem();
  steering.setDegreesPerSecond(5);
  const steeringSystem = new VesselSystem();
  steeringSystem.setSteeringSystem(steering);
  return steeringSystem;
}

function getTorpedoGuidanceSystem(): VesselSystem {
  const guidance = new GuidanceSystem();
  const guidanceSystem = new VesselSystem();
  guidanceSystem.setGuidanceSystem(guidance);
  return guidanceSystem;
}

function getTorpedoSelfDestructSystem(): VesselSystem {
  const selfDestruct = new SelfDestructSystem();
  selfDestruct.setKillRadiusFeet(50);
  selfDestruct.setTriggerRadiusFeet(50);
  const selfDestructSystem = new VesselSystem();
  selfDestructSystem.setSelfDestructSystem(selfDestruct);
  return selfDestructSystem;
}

function getTorpedoHullSystem(): VesselSystem {
  const hull = new HullSystem();
  // Draft is actually just minimum depth, and since torpedoes don't have diving
  // systems yet, let's set this to something more than it actually is.
  hull.setDraftFeet(15);
  hull.setSonarReturn(0.1);
  const hullSystem = new VesselSystem();
  hullSystem.setHullSystem(hull);
  return hullSystem;
}

function getTorpedoSonarSystem(): VesselSystem {
  const sonarArray = new SonarSystem.SonarArray();
  sonarArray.setUniqueId("fore");
  sonarArray.setNoiseFloor(0);

  const sonar = new SonarSystem();
  sonar.addSonarArrays(sonarArray);
  const sonarSystem = new VesselSystem();
  sonarSystem.setSonarSystem(sonar);
  return sonarSystem;
}

function getTorpedoDescriptor() {
  const torpedo = new VesselDescriptor();
  torpedo.setUniqueId("adcap");
  torpedo.addSystems(getTorpedoPropulsionSystem());
  torpedo.addSystems(getTorpedoSteeringSystem());
  torpedo.addSystems(getTorpedoGuidanceSystem());
  torpedo.addSystems(getTorpedoSelfDestructSystem());
  torpedo.addSystems(getTorpedoHullSystem());
  torpedo.addSystems(getTorpedoSonarSystem());
  // Torpedoes don't need to dive right now.
  return torpedo;
}

function getNoisemakerPropulsionSystem(): VesselSystem {
  const propulsion = new PropulsionSystem();
  propulsion.setMaxSpeedKnots(0);
  propulsion.setBaseNoisePower(30);
  const propulsionSystem = new VesselSystem();
  propulsionSystem.setPropulsionSystem(propulsion);
  return propulsionSystem;
}

function getNoisemakerSelfDestructSystem(): VesselSystem {
  const selfDestruct = new SelfDestructSystem();
  // 15 minutes of fun!
  selfDestruct.setSelfDestructTimerSeconds(900);
  const selfDestructSystem = new VesselSystem();
  selfDestructSystem.setSelfDestructSystem(selfDestruct);
  return selfDestructSystem;
}

function getNoisemakerHullSystem(): VesselSystem {
  const hull = new HullSystem();
  hull.setDraftFeet(15);
  hull.setSonarReturn(0.1);
  const hullSystem = new VesselSystem();
  hullSystem.setHullSystem(hull);
  return hullSystem;
}

function getNoisemakerDescriptor() {
  const noisemaker = new VesselDescriptor();
  noisemaker.setUniqueId("noisemaker");
  noisemaker.addSystems(getNoisemakerPropulsionSystem());
  noisemaker.addSystems(getNoisemakerSelfDestructSystem());
  noisemaker.addSystems(getNoisemakerHullSystem());
  return noisemaker;
}

function getDecoySelfDestructSystem(): VesselSystem {
  const selfDestruct = new SelfDestructSystem();
  // 15 minutes of fun!
  selfDestruct.setSelfDestructTimerSeconds(900);
  const selfDestructSystem = new VesselSystem();
  selfDestructSystem.setSelfDestructSystem(selfDestruct);
  return selfDestructSystem;
}

function getDecoyHullSystem(): VesselSystem {
  const hull = new HullSystem();
  hull.setDraftFeet(15);
  hull.setSonarReturn(1.1);
  const hullSystem = new VesselSystem();
  hullSystem.setHullSystem(hull);
  return hullSystem;
}

function getDecoyDescriptor() {
  const torpedo = new VesselDescriptor();
  torpedo.setUniqueId("decoy");
  torpedo.addSystems(getDecoySelfDestructSystem());
  torpedo.addSystems(getDecoyHullSystem());
  return torpedo;
}

export default buildNewFeasibleScenario;
