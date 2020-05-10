import { MassBackendPromiseClient } from "../../mass/api/mass_grpc_web_pb";
import { ConnectRequest } from "../../mass/api/mass_pb";
import { Scenario, VesselDescriptor } from "../../mass/api/scenario_pb";
import { DoActionRequest, DoActionResponse } from "../../mass/api/actions_pb";
import {
  SteeringSystem,
  DivingSystem,
  PropulsionSystem,
  MapSystem,
  VesselSystem,
} from "../../mass/api/systems_pb";
import { VesselUpdate } from "../../mass/api/updates_pb";
import { Pipe } from "./util";
import { v4 } from "uuid";

const client = new MassBackendPromiseClient("http://subsim.io");

export type WorldEvent = VesselUpdate;

interface Game {
  scenarioId: string;
  vesselId: string;
  worldEvents: Pipe<WorldEvent>;
  performAction: (action: DoActionRequest) => Promise<DoActionResponse>;
}

function buildNewFeasibleScenario(vesselId: string): Scenario {
  const scenario = new Scenario();
  const player = new VesselDescriptor();
  player.setUniqueId(vesselId);

  // Systems for the player

  const steering = new SteeringSystem();
  steering.setDegreesPerSecond(10);
  const diving = new DivingSystem();
  diving.setFeetPerSecond(10);
  diving.setMaxDepthFeet(1000);
  const propulsion = new PropulsionSystem();
  propulsion.setKnotsPerSecond(2);
  propulsion.setMaxSpeedKnots(30);
  const map = new MapSystem();

  const vesselSystem = new VesselSystem();
  vesselSystem.setDivingSystem(diving);
  vesselSystem.setSteeringSystem(steering);
  vesselSystem.setPropulsionSystem(propulsion);
  vesselSystem.setMapSystem(map);

  player.addSystems(vesselSystem);
  return scenario;
}

function createNewGame(): Game {
  const scenarioId = v4();
  const vesselId = v4();

  const scenario = new Scenario();
  const player = new VesselDescriptor();
  player.setUniqueId("vesselId");

  const connectionReq = new ConnectRequest();
  connectionReq.setVesselUniqueId(vesselId);
  connectionReq.setScenarioId(scenarioId);
  connectionReq.setScenario(buildNewFeasibleScenario(vesselId));

  const worldEvents = new Pipe<WorldEvent>();

  // The reason we're wrapping this in a pipe is so that
  // we can reconnect if necessary...
  const stream = client.connect(connectionReq);

  stream.on("status", () => {
    debugger;
  });

  stream.on("end", () => {
    debugger;
  });

  stream.on("data", (response: any) => {
    console.log("WE GET SIGNAL");
    worldEvents.fire(response.getMessage());
  });

  function performAction(arg: DoActionRequest) {
    return client.doAction(arg);
  }

  return {
    scenarioId,
    vesselId,
    worldEvents,
    performAction,
  };
}

const game = createNewGame();
game.worldEvents.listen((update) => console.log(update));
