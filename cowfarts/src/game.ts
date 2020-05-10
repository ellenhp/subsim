import { v4 } from "uuid";

import { MassBackendClient } from "./__protogen__/mass/api/MassServiceClientPb";
import { ConnectRequest } from "./__protogen__/mass/api/mass_pb";
import { VesselUpdate } from "./__protogen__/mass/api/updates_pb";
import {
  DoActionRequest,
  DoActionResponse,
  SystemRequest,
  PropulsionSystemRequest,
} from "./__protogen__/mass/api/actions_pb";
import { Pipe } from "./util";

import buildNewFeasibleScenario from "./builders/feasibleScenario";

const client = new MassBackendClient("http://subsim.io");

export interface Game {
  scenarioId: string;
  vesselId: string;
  worldEvents: Pipe<VesselUpdate.AsObject>;
  performAction: (
    action: DoActionRequest
  ) => Promise<DoActionResponse.AsObject>;
}

export function createNewGame(): Game {
  const scenarioId = v4();
  const playerId = "user";

  const connectionReq = new ConnectRequest();
  connectionReq.setVesselUniqueId(playerId);
  connectionReq.setScenarioId(scenarioId);
  connectionReq.setScenario(buildNewFeasibleScenario(playerId));

  const worldEvents = new Pipe<VesselUpdate.AsObject>();

  // The reason we're wrapping this in a pipe is so that
  // we can reconnect if necessary...
  console.log(connectionReq.toObject());
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
    vesselId: playerId,
    worldEvents,
    performAction,
  };
}

export function requestSpeed(game: Game, speed: number) {
  const speedRequest = new DoActionRequest();

  const speedSystemsRequest = new PropulsionSystemRequest();
  speedSystemsRequest.setSpeedKnots(speed);
  const systemsRequest = new SystemRequest();
  systemsRequest.setPropulsionRequest(speedSystemsRequest);

  speedRequest.setScenarioId(game.scenarioId);
  speedRequest.setVesselId(game.vesselId);
  speedRequest.setSystemRequestsList([systemsRequest]);

  client.doAction(speedRequest, {}, console.log);
}
