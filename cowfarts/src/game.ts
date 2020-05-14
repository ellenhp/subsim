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
import { GameId } from "./commonTypes";
import { Scenario } from "./__protogen__/mass/api/scenario_pb";

import buildNewFeasibleScenario from "./builders/feasibleScenario";
import { setGameHash } from "./util/url";

const client = new MassBackendClient("http://35.224.26.74");

export interface GameConnection {
  scenarioId: string;
  vesselId: string;
  worldEvents: Pipe<VesselUpdate.AsObject>;
  performAction: (
    action: DoActionRequest
  ) => Promise<DoActionResponse.AsObject>;
}

export function joinGame(id: GameId): GameConnection {
  return connectToGame(id);
}

export function createNewGame(): GameConnection {
  const gameId = {
    scenarioId: v4(),
    vesselId: "user",
  };
  const scenario = buildNewFeasibleScenario(gameId.vesselId);
  return connectToGame(gameId, scenario);
}

function connectToGame(id: GameId, scenario?: Scenario): GameConnection {
  const { scenarioId, vesselId } = id;
  const connectionReq = new ConnectRequest();
  connectionReq.setVesselUniqueId(vesselId);
  connectionReq.setScenarioId(scenarioId);
  connectionReq.setScenario(buildNewFeasibleScenario(vesselId));

  const worldEvents = new Pipe<VesselUpdate.AsObject>();

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
    vesselId,
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
