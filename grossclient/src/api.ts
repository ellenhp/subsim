import { MassBackendClient } from "./__protogen__/mass/api/MassServiceClientPb";
import { ConnectRequest } from "./__protogen__/mass/api/mass_pb";
import { MASS_BACKEND_URL } from "./constants";

const massClient = new MassBackendClient(MASS_BACKEND_URL);

massClient.connect(new ConnectRequest());
