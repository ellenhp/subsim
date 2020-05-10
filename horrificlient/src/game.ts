import * as mass_grpc_web from "../../mass/api/mass_grpc_web_pb";
import * as mass_pb from "../../mass/api/mass_pb";
import { Pipe } from "./util";
import { v4 } from "uuid";

const client = new mass_grpc_web.MassBackendPromiseClient("http://subsim.io");
const request = new mass_pb.ConnectRequest();
client.connect(request);

interface Game {
  gameId: string;
  vesselId: string;
  worldEvents: Pipe<any>;
  performAction: (action: any) => (response: any) => unknown;
}

function createNewGame() {
  const gameId = v4();
  const vesselId = v4();
}
