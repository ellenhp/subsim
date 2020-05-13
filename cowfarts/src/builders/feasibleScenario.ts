import { v4 } from "uuid";

import { MassBackendClient } from "../__protogen__/mass/api/MassServiceClientPb";
import { ConnectRequest } from "../__protogen__/mass/api/mass_pb";
import {
  VesselDescriptor,
  Scenario,
  SpawnedVessel,
  Faction,
  EndCondition,
} from "../__protogen__/mass/api/scenario_pb";
import { VesselUpdate } from "../__protogen__/mass/api/updates_pb";
import {
  DoActionRequest,
  DoActionResponse,
} from "../__protogen__/mass/api/actions_pb";
import {
  SteeringSystem,
  DivingSystem,
  PropulsionSystem,
  MapSystem,
  VesselSystem,
  HullSystem,
  SonarSystem,
} from "../__protogen__/mass/api/systems_pb";
import { Pipe } from "../util/pipe";
import {
  Bounds,
  Position,
  HeadingBounds,
} from "../__protogen__/mass/api/spatial_pb";

function buildNewFeasibleScenario(playerId: string): Scenario {
  const vesselId = v4();

  // Systems for the player

  const steering = new SteeringSystem();
  steering.setDegreesPerSecond(10);
  const steeringSystem = new VesselSystem();
  steeringSystem.setSteeringSystem(steering);

  const diving = new DivingSystem();
  diving.setFeetPerSecond(10);
  diving.setMaxDepthFeet(1000);
  const divingSystem = new VesselSystem();
  divingSystem.setDivingSystem(diving);

  const propulsion = new PropulsionSystem();
  propulsion.setKnotsPerSecond(2);
  propulsion.setMaxSpeedKnots(30);
  propulsion.setBaseNoisePower(10);
  propulsion.setNoisePerKnotNoncavitating(3);
  const propulsionSystem = new VesselSystem();
  propulsionSystem.setPropulsionSystem(propulsion);

  const map = new MapSystem();
  const mapSystem = new VesselSystem();
  mapSystem.setMapSystem(map);

  const hull = new HullSystem();
  const hullSystem = new VesselSystem();
  hullSystem.setHullSystem(hull);

  const sonarArray = new SonarSystem.SonarArray();
  sonarArray.setUniqueId("fore");
  sonarArray.setNoiseFloor(0);

  const sonar = new SonarSystem();
  sonar.addSonarArrays(sonarArray);
  const sonarSystem = new VesselSystem();
  sonarSystem.setSonarSystem(sonar);

  const vesselDescriptor = new VesselDescriptor();
  vesselDescriptor.setUniqueId(vesselId);
  vesselDescriptor.setType(0);
  vesselDescriptor.addSystems(steeringSystem);
  vesselDescriptor.addSystems(divingSystem);
  vesselDescriptor.addSystems(propulsionSystem);
  vesselDescriptor.addSystems(mapSystem);
  vesselDescriptor.addSystems(hullSystem);
  vesselDescriptor.addSystems(sonarSystem);

  const playerSpawn = new Position();
  playerSpawn.setLat(47.603);
  playerSpawn.setLng(-122.374);

  const playerSpawnInfo = new SpawnedVessel.SpawnInformation();
  playerSpawnInfo.setPosition(playerSpawn);
  playerSpawnInfo.setExactSpawnHeading(270);

  const headingBounds = new HeadingBounds();
  headingBounds.setLeftBound(10);
  headingBounds.setLeftBound(11);

  // Building Enemy Spawn info
  const enemyNePos = new Position();
  enemyNePos.setLat(47.632545);
  enemyNePos.setLng(-122.474061);

  const enemySwPos = new Position();
  enemySwPos.setLat(47.581621);
  enemySwPos.setLng(-122.417695);

  const enemySpawnBounds = new Bounds();
  enemySpawnBounds.setNorthEast(enemyNePos);
  enemySpawnBounds.setSouthWest(enemySwPos);

  const enemySpawnInfo = new SpawnedVessel.SpawnInformation();
  enemySpawnInfo.setBounds(enemySpawnBounds);
  enemySpawnInfo.setHeadingBounds(headingBounds);

  const playerFaction = new Faction();
  playerFaction.setPlayerControlled(true);
  playerFaction.setName("player");

  const enemyFaction = new Faction();
  enemyFaction.setPlayerControlled(true);
  enemyFaction.setName("enemy");

  const playerVessel = new SpawnedVessel();
  playerVessel.setVesselDescriptorId(vesselId);
  playerVessel.setUniqueId(playerId);
  playerVessel.setSpawnInfo(playerSpawnInfo);
  playerVessel.setFaction(playerFaction);

  const enemyVessel = new SpawnedVessel();
  enemyVessel.setVesselDescriptorId(vesselId);
  enemyVessel.setUniqueId(v4());
  enemyVessel.setSpawnInfo(enemySpawnInfo);
  enemyVessel.setFaction(enemyFaction);

  const endCondition = new EndCondition();
  endCondition.setFactionEliminated(playerFaction);
  endCondition.setWinningFaction(enemyFaction);

  const scnNePos = new Position();
  scnNePos.setLat(48.1900463);
  scnNePos.setLng(-123.1800463);

  const scnSwPos = new Position();
  scnSwPos.setLat(47.0099536);
  scnSwPos.setLng(-122.1601388);

  const scnBounds = new Bounds();
  scnBounds.setNorthEast(scnNePos);
  scnBounds.setSouthWest(scnSwPos);

  const scenario = new Scenario();
  scenario.addVesselDescriptors(vesselDescriptor);
  scenario.addVessels(playerVessel);
  scenario.addVessels(enemyVessel);
  scenario.addEndConditions(endCondition);
  scenario.setScenarioBounds(scnBounds);

  return scenario;
}

export default buildNewFeasibleScenario;
