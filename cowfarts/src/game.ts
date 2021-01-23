import { v4 } from "uuid";

import { MassBackendClient } from "./__protogen__/mass/api/MassServiceClientPb";
import { ConnectRequest } from "./__protogen__/mass/api/mass_pb";
import { VesselUpdate } from "./__protogen__/mass/api/updates_pb";
import {
  DoActionRequest,
  DoActionResponse,
} from "./__protogen__/mass/api/actions_pb";
import { Pipe } from "./util/pipe";
import { GameId } from "./commonTypes";
import buildNewFeasibleScenario from "./builders/feasibleScenario";
import { Scenario } from "./__protogen__/mass/api/scenario_pb";
import { ClientReadableStream } from "grpc-web";

const client = new MassBackendClient("http://subsim.ellenhp.me");

export interface GameConnection {
  scenarioId: string;
  vesselId: string;
  worldEvents: Pipe<VesselUpdate.AsObject>;
  performAction: (
    action: DoActionRequest
  ) => Promise<DoActionResponse.AsObject>;
}

export function joinGame(id: GameId): GameConnection {
  return connectToGame(id, buildNewFeasibleScenario());
}

export function createNewGame(id: GameId): GameConnection {
  return connectToGame(id, buildNewFeasibleScenario());
}

function connectToGame(id: GameId, scenario?: Scenario): GameConnection {
  const { scenarioId, vesselId } = id;
  const connectionReq = new ConnectRequest();
  connectionReq.setVesselUniqueId(vesselId);
  connectionReq.setScenarioId(scenarioId);
  if (scenario) {
    connectionReq.setScenario(scenario);
  }

  const worldEvents = new Pipe<VesselUpdate.AsObject>();
  let stream: ClientReadableStream<VesselUpdate>;

  const createStream = () => {
    stream = client.connect(connectionReq);
    stream.on("data", streamListener);
  };

  let streamDeadmanSwitch: NodeJS.Timeout | undefined;
  const streamListener = (response: VesselUpdate) => {
    if (streamDeadmanSwitch) {
      clearTimeout(streamDeadmanSwitch);
    }
    streamDeadmanSwitch = setTimeout(() => {
      console.log("Reconnecting stream after 1s without messages");
      stream.cancel();
      createStream();
    }, 1000);
    worldEvents.fire(response.toObject());
  };

  createStream();

  function performAction(arg: DoActionRequest) {
    return new Promise((resolve) => {
      return client.doAction(arg, {}, (result) => resolve(result));
    });
  }

  // Start keepalives after 10 seconds
  setTimeout(
    () => setInterval(() => performAction(new DoActionRequest()), 10000),
    10000
  );

  return {
    scenarioId,
    vesselId,
    worldEvents,
    performAction,
  };
}
