import { v4 } from "uuid";

import { MassBackendClient } from "./__protogen__/mass/api/MassServiceClientPb";
import { ConnectRequest } from "./__protogen__/mass/api/mass_pb";
import { VesselUpdate } from "./__protogen__/mass/api/updates_pb";
import {
  DoActionRequest,
  DoActionResponse,
  SystemRequest,
  PropulsionSystemRequest,
  SteeringSystemRequest,
} from "./__protogen__/mass/api/actions_pb";
import { Pipe } from "./util/pipe";

import buildNewFeasibleScenario from "./builders/feasibleScenario";

const client = new MassBackendClient("http://35.224.26.74");

export interface GameConnection {
  scenarioId: string;
  vesselId: string;
  worldEvents: Pipe<VesselUpdate.AsObject>;
  performAction: (
    action: DoActionRequest
  ) => Promise<DoActionResponse.AsObject>;
}

export function createNewGame(): GameConnection {
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

  var deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 600);

  let stream;

  const createStream = () => {
    stream = client.connect(connectionReq, {
      deadline: `${deadline.getTime()}`,
    });

    stream.on("data", (response) => {
      worldEvents.fire(response.toObject());
    });
  };

  createStream();

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

export function requestSpeed(game: GameConnection, speed: number) {
  const speedRequest = new DoActionRequest();

  const speedSystemsRequest = new PropulsionSystemRequest();
  speedSystemsRequest.setSpeedKnots(speed);
  const systemsRequest = new SystemRequest();
  systemsRequest.setPropulsionRequest(speedSystemsRequest);

  speedRequest.setScenarioId(game.scenarioId);
  speedRequest.setVesselId(game.vesselId);
  speedRequest.setSystemRequestsList([systemsRequest]);

  client.doAction(speedRequest, {}, (response) => {});
}

export function requestHeading(game: GameConnection, heading: number) {
  if (heading < 0 || heading >= 360) {
    throw `${heading} IS NOT A VALID HEADING`;
  }
  const headingRequest = new DoActionRequest();

  const steeringSystemRequest = new SteeringSystemRequest();
  steeringSystemRequest.setHeadingDegrees(heading);
  const systemsRequest = new SystemRequest();
  systemsRequest.setSteeringRequest(steeringSystemRequest);

  headingRequest.setScenarioId(game.scenarioId);
  headingRequest.setVesselId(game.vesselId);
  headingRequest.setSystemRequestsList([systemsRequest]);

  client.doAction(headingRequest, {}, (response) => {});
}
