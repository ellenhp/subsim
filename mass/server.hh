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

#include <map>
#include <string>

#include "mass/api/mass.grpc.pb.h"
#include "sim.hh"

namespace mass {

class MassServer {
 public:
  MassServer(std::string server_address_and_port);

  void run_server_forever();
  void run_game_loop_nonblocking(std::shared_ptr<Sim> sim,
                                 std::string unique_id);

 private:
  void run_game_loop_until_stale(std::string unique_id);

  std::string server_address_and_port_;
  std::map<std::string, std::shared_ptr<Sim>> sims_;

  std::mutex sim_map_modification_mutex_;
};

class MassBackendImpl final : public api::MassBackend::Service {
 public:
  MassBackendImpl(MassServer *server);

  grpc::Status Connect(
      grpc::ServerContext *context,
      grpc::ServerReaderWriter<api::VesselUpdate, api::ConnectRequest> *stream);

 private:
  MassServer *server_;
};

}  // namespace mass
