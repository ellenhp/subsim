// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "server.hh"

using namespace mass;

grpc::Status MassBackendImpl::Connect(
    ::grpc::ServerContext *context,
    grpc::ServerReaderWriter<api::VesselUpdate, api::ConnectRequest> *stream) {
  return grpc::Status::OK;
}

MassServer::MassServer(std::string server_address_and_port) {
  _server_address_and_port = server_address_and_port;
}

void MassServer::run_server_forever() {
  MassBackendImpl service;

  grpc::EnableDefaultHealthCheckService(true);
  grpc::reflection::InitProtoReflectionServerBuilderPlugin();
  grpc::ServerBuilder builder;
  builder.AddListeningPort(_server_address_and_port,
                           grpc::InsecureServerCredentials());
  builder.RegisterService(&service);
  std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
  server->Wait();
}
