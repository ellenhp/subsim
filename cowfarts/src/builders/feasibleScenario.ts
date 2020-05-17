import {v4} from 'uuid';

import {DoActionRequest, DoActionResponse,} from '../__protogen__/mass/api/actions_pb';
import {ConnectRequest} from '../__protogen__/mass/api/mass_pb';
import {MassBackendClient} from '../__protogen__/mass/api/MassServiceClientPb';
import {EndCondition, Faction, Scenario, SpawnedVessel, VesselDescriptor,} from '../__protogen__/mass/api/scenario_pb';
import {Bounds, HeadingBounds, Position,} from '../__protogen__/mass/api/spatial_pb';
import {DivingSystem, HullSystem, MapSystem, PropulsionSystem, SonarSystem, SteeringSystem, VesselSystem,} from '../__protogen__/mass/api/systems_pb';
import {VesselUpdate} from '../__protogen__/mass/api/updates_pb';
import {Pipe} from '../util/pipe';

function buildNewFeasibleScenario(playerId: string): Scenario {
  const submarineDescriptorId = v4();

  // Systems for the player

  const steering = new SteeringSystem();
  steering.setDegreesPerSecond(4);
  const steeringSystem = new VesselSystem();
  steeringSystem.setSteeringSystem(steering);

  const diving = new DivingSystem();
  diving.setFeetPerSecond(3);
  diving.setMaxDepthFeet(1000);
  const divingSystem = new VesselSystem();
  divingSystem.setDivingSystem(diving);

  const propulsion = new PropulsionSystem();
  propulsion.setKnotsPerSecond(1);
  propulsion.setMaxSpeedKnots(33);
  propulsion.setBaseNoisePower(10);
  propulsion.setNoisePerKnotNoncavitating(2);
  const propulsionSystem = new VesselSystem();
  propulsionSystem.setPropulsionSystem(propulsion);

  const map = new MapSystem();
  const mapSystem = new VesselSystem();
  mapSystem.setMapSystem(map);

  const hull = new HullSystem();
  hull.setDraftFeet(31);
  const hullSystem = new VesselSystem();
  hullSystem.setHullSystem(hull);

  const sonarArray = new SonarSystem.SonarArray();
  sonarArray.setUniqueId('fore');
  sonarArray.setNoiseFloor(0);

  const sonar = new SonarSystem();
  sonar.addSonarArrays(sonarArray);
  const sonarSystem = new VesselSystem();
  sonarSystem.setSonarSystem(sonar);

  const submarine = new VesselDescriptor();
  submarine.setUniqueId(submarineDescriptorId);
  submarine.setType(2);
  submarine.addSystems(steeringSystem);
  submarine.addSystems(divingSystem);
  submarine.addSystems(propulsionSystem);
  submarine.addSystems(mapSystem);
  submarine.addSystems(hullSystem);
  submarine.addSystems(sonarSystem);

  const playerSpawn = new Position();
  playerSpawn.setLat(47.603);
  playerSpawn.setLng(-122.374);

  const playerSpawnInfo = new SpawnedVessel.SpawnInformation();
  playerSpawnInfo.setPosition(playerSpawn);
  playerSpawnInfo.setExactSpawnHeading(270);

  const headingBounds = new HeadingBounds();
  headingBounds.setLeftBound(10);
  headingBounds.setLeftBound(11);

  // Building Enemy Spawn info (NEAR)
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

  // Building Enemy Spawn Info (FAR + QUIET)
  const enemyFarNePos = new Position();
  enemyFarNePos.setLat(47.897931);
  enemyFarNePos.setLng(-122.478928);

  const enemyFarSwPos = new Position();
  enemyFarSwPos.setLat(47.839432);
  enemyFarSwPos.setLng(-122.390979);

  const enemyFarSpawnBounds = new Bounds();
  enemyFarSpawnBounds.setNorthEast(enemyFarNePos);
  enemyFarSpawnBounds.setSouthWest(enemyFarSwPos);

  const enemyFarSpawnInfo = new SpawnedVessel.SpawnInformation();
  enemyFarSpawnInfo.setBounds(enemyFarSpawnBounds);
  enemyFarSpawnInfo.setHeadingBounds(headingBounds);

  const playerFaction = new Faction();
  playerFaction.setPlayerControlled(true);
  playerFaction.setName('player');

  const enemyFaction = new Faction();
  enemyFaction.setPlayerControlled(true);
  enemyFaction.setName('enemy');

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

  // Far one!
  const enemyFarVessel = new SpawnedVessel();
  enemyFarVessel.setVesselDescriptorId(vesselId);
  enemyFarVessel.setUniqueId(v4());
  enemyFarVessel.setSpawnInfo(enemyFarSpawnInfo);
  enemyFarVessel.setFaction(enemyFaction);

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
  scenario.addVessels(enemyFarVessel);
  scenario.addEndConditions(endCondition);
  scenario.setScenarioBounds(scnBounds);

  return scenario;
}

export default buildNewFeasibleScenario;
