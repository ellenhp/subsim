import * as mass_grpc_web_pb from '../mass/api/mass_grpc_web_pb';
import * as mass_pb from '../mass/api/mass_pb';

var client = new mass_grpc_web_pb.MassBackendPromiseClient('subsim.io')
var request = new mass_pb.ConnectRequest()
console.log(client.connect(request))
