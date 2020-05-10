import { MassBackendClient } from "./__protogen__/mass/api/MassServiceClientPb";
import { ConnectRequest } from "./__protogen__/mass/api/mass_pb";

const client = new MassBackendClient("http://subsim.io");
const connection = client.connect(new ConnectRequest());
connection.on("data", (data) => {
  console.log(data);
});
