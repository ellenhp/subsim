import { MassBackendPromiseClient } from "../../mass/api/mass_grpc_web_pb";
import { ConnectRequest } from "../../mass/api/mass_pb";
import { VesselUpdate } from "../../mass/api/updates_pb";
import { Pipe } from "./util";
import { v4 } from "uuid";

const client = new MassBackendPromiseClient("http://subsim.io");

interface Game {
  scenarioId: string;
  vesselId: string;
  worldEvents: Pipe<VesselUpdate>;
  performAction: (action: any) => (response: any) => unknown;
}

function createNewGame(): Game {
  const scenarioId = v4();
  const vesselId = v4();

  const connectionReq = new ConnectRequest();
  connectionReq.setVesselUniqueId(vesselId);
  connectionReq.setScenarioId(scenarioId);

  const worldEvents = new Pipe<VesselUpdate>();

  const request = new ConnectRequest();
  // The reason we're wrapping this in a pipe is so that
  // we can reconnect if necessary...
  client.connect(request).then((response: VesselUpdate) => {
    worldEvents.fire(response);
  });

  function performAction() {
    client.
  }

  return {
    scenarioId,
    vesselId,
    worldEvents,
    performAction,
  };
}

createNewGame();
