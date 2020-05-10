import { v4 } from "uuid";

import { MassBackendClient } from "./__protogen__/mass/api/MassServiceClientPb";
import { ConnectRequest } from "./__protogen__/mass/api/mass_pb";
import {
  VesselDescriptor,
  Scenario,
} from "./__protogen__/mass/api/scenario_pb";
import { VesselUpdate } from "./__protogen__/mass/api/updates_pb";
import {
  DoActionRequest,
  DoActionResponse,
} from "./__protogen__/mass/api/actions_pb";
import {
  SteeringSystem,
  DivingSystem,
  PropulsionSystem,
  MapSystem,
  VesselSystem,
} from "./__protogen__/mass/api/systems_pb";
import { Pipe } from "./util";

const client = new MassBackendClient("http://subsim.io");

export interface Game {
  scenarioId: string;
  vesselId: string;
  worldEvents: Pipe<VesselUpdate.AsObject>;
  performAction: (
    action: DoActionRequest
  ) => Promise<DoActionResponse.AsObject>;
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

export function createNewGame(): Game {
  const scenarioId = v4();
  const vesselId = "user";

  const player = new VesselDescriptor();
  player.setUniqueId("vesselId");

  const connectionReq = new ConnectRequest();
  connectionReq.setVesselUniqueId(vesselId);
  connectionReq.setScenarioId(scenarioId);
  connectionReq.setScenario(buildNewFeasibleScenario(vesselId));

  const worldEvents = new Pipe<VesselUpdate.AsObject>();

  // The reason we're wrapping this in a pipe is so that
  // we can reconnect if necessary...
  const stream = client.connect(connectionReq);

  stream.on("data", (response) => {
    worldEvents.fire(response.toObject());
  });

  function performAction(arg: DoActionRequest) {
    return new Promise((resolve) => {
      return client.doAction(arg, {}, (result) => resolve(result));
    });
  }

  return {
    scenarioId,
    vesselId,
    worldEvents,
    performAction,
  };
}
