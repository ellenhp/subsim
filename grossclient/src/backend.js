/*eslint-disable no-undef*/
import * as grpcWeb from "grpc-web";
import { MASS_BACKEND_URL } from "./constants";
const { ConnectRequest } = require("./__protogen__/mass/api/mass_pb.js");
const {
  MassBackendClient,
} = require("./__protogen__/mass/api/mass_grpc_web_pb.js");

const massBackendClient = new MassBackendClient(MASS_BACKEND_URL, null, null);

console.log(massBackendClient.connect(new ConnectRequest()));

/*eslint-enable no-undef*/
