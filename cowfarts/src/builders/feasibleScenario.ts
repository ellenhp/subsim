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
  const propulsionSystem = new VesselSystem();
  propulsionSystem.setPropulsionSystem(propulsion);

  const map = new MapSystem();
  const mapSystem = new VesselSystem();
  mapSystem.setMapSystem(map);

  const vesselDescriptor = new VesselDescriptor();
  vesselDescriptor.setUniqueId(vesselId);
  vesselDescriptor.setType(0);
  vesselDescriptor.addSystems(steeringSystem);
  vesselDescriptor.addSystems(divingSystem);
  vesselDescriptor.addSystems(propulsionSystem);
  vesselDescriptor.addSystems(mapSystem);

  const nePos = new Position();
  nePos.setLat(100);
  nePos.setLng(100);

  const swPos = new Position();
  swPos.setLat(101);
  swPos.setLng(101);

  const bounds = new Bounds();
  bounds.setNorthEast(nePos);
  bounds.setSouthWest(swPos);

  const headingBounds = new HeadingBounds();
  headingBounds.setLeftBound(10);
  headingBounds.setLeftBound(11);

  const spawnInfo = new SpawnedVessel.SpawnInformation();
  spawnInfo.setBounds(bounds);
  spawnInfo.setPosition(nePos);
  spawnInfo.setExactSpawnHeading(10);
  spawnInfo.setHeadingBounds(headingBounds);

  const playerFaction = new Faction();
  playerFaction.setPlayerControlled(true);
  playerFaction.setName("player");

  const enemyFaction = new Faction();
  enemyFaction.setPlayerControlled(true);
  enemyFaction.setName("enemy");

  const playerVessel = new SpawnedVessel();
  playerVessel.setVesselDescriptorId(vesselId);
  playerVessel.setUniqueId(playerId);
  playerVessel.setSpawnInfo(spawnInfo);
  playerVessel.setFaction(playerFaction);

  const enemyVessel = new SpawnedVessel();
  enemyVessel.setVesselDescriptorId(vesselId);
  enemyVessel.setUniqueId(v4());
  enemyVessel.setSpawnInfo(spawnInfo);
  enemyVessel.setFaction(enemyFaction);

  const endCondition = new EndCondition();
  endCondition.setFactionEliminated(playerFaction);
  endCondition.setWinningFaction(enemyFaction);

  const scnNePos = new Position();
  scnNePos.setLat(99);
  scnNePos.setLng(99);

  const scnSwPos = new Position();
  scnSwPos.setLat(102);
  scnSwPos.setLng(102);

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
