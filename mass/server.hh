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

#pragma once

#include <grpcpp/ext/proto_server_reflection_plugin.h>
#include <grpcpp/grpcpp.h>
#include <grpcpp/health_check_service_interface.h>

#include "mass/api/mass.grpc.pb.h"

namespace mass {

class MassBackendImpl final : public api::MassBackend::Service {
 public:
  grpc::Status Connect(
      grpc::ServerContext *context,
      grpc::ServerReaderWriter<api::VesselUpdate, api::ConnectRequest> *stream);
};

class MassServer {
 public:
  MassServer(std::string server_address_and_port);

  void run_server_forever();

 private:
  std::string _server_address_and_port;
};

}  // namespace mass
