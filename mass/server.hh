// Copyright (C) 2020 Ellen Poe
//
// This file is part of MASS.
//
// MASS is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// MASS is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with MASS.  If not, see <http://www.gnu.org/licenses/>.

#pragma once

#include <grpcpp/ext/proto_server_reflection_plugin.h>
#include <grpcpp/grpcpp.h>
#include <grpcpp/health_check_service_interface.h>

#include <map>
#include <string>
#include <thread>

#include "mass/api/mass.grpc.pb.h"
#include "sim.hh"

namespace mass {

class MassServer {
 public:
  MassServer(std::string server_address_and_port);

  void run_server_forever();
  void run_game_loop_nonblocking(std::shared_ptr<Sim> sim,
                                 std::string unique_id);
  api::VesselUpdate get_update_for(std::string scenario_unique_id,
                                   std::string vessel_unique_id);
  void push_request(api::DoActionRequest request);

 private:
  void run_game_loop_until_stale(std::string unique_id);

  std::string server_address_and_port_;
  std::map<std::string, std::shared_ptr<Sim>> sims_;

  std::mutex sim_map_modification_mutex_;

  bool shutting_down_;

  std::vector<std::thread> the_place_where_threads_go_to_die_;
};

class MassBackendImpl final : public api::MassBackend::Service {
 public:
  MassBackendImpl(MassServer *server);

  grpc::Status Connect(grpc::ServerContext *context,
                       const ::api::ConnectRequest *request,
                       grpc::ServerWriter<api::VesselUpdate> *stream) override;

  grpc::Status DoAction(grpc::ServerContext *context,
                        const ::api::DoActionRequest *request,
                        api::DoActionResponse *response) override;

 private:
  MassServer *server_;
};

}  // namespace mass
