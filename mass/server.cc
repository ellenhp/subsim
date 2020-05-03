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

#include <iostream>
#include <thread>

using namespace mass;

using std::cout;
using std::endl;
using std::make_shared;
using std::shared_ptr;
using std::string;
using std::this_thread::sleep_for;

MassBackendImpl::MassBackendImpl(MassServer *server) : server_(server) {}

grpc::Status MassBackendImpl::Connect(
    ::grpc::ServerContext *context,
    grpc::ServerReaderWriter<api::VesselUpdate, api::ConnectRequest> *stream) {
  api::ConnectRequest request;
  if (!stream->Read(&request)) {
    return grpc::Status::CANCELLED;
  }
  string scenario_id = request.scenario_id;
  server_->run_game_loop_nonblocking(make_shared<Sim>(request.scenario),
                                     request.scenario_id);

  api::VesselUpdate update;
  cout << "Writing update." << endl;
  while (stream->Write(
      server_->get_update_for(scenario_id, request.vessel_unique_id))) {
    sleep_for(std::chrono::milliseconds(50));
    cout << "Writing update." << endl;
  }
  cout << "Wrote last update." << endl;
  return grpc::Status::OK;
}

MassServer::MassServer(std::string server_address_and_port)
    : server_address_and_port_(server_address_and_port) {}

void MassServer::run_server_forever() {
  MassBackendImpl service(this);

  grpc::EnableDefaultHealthCheckService(true);
  grpc::reflection::InitProtoReflectionServerBuilderPlugin();
  grpc::ServerBuilder builder;
  builder.AddListeningPort(server_address_and_port_,
                           grpc::InsecureServerCredentials());
  builder.RegisterService(&service);
  cout << "Starting server." << endl;
  std::unique_ptr<grpc::Server> server(builder.BuildAndStart());
  cout << "Waiting for server to shut down." << endl;
  server->Wait();
}

void MassServer::run_game_loop_nonblocking(std::shared_ptr<Sim> sim,
                                           std::string unique_id) {
  const std::lock_guard<std::mutex> lock(sim_map_modification_mutex_);
  if (sims_[unique_id] != nullptr) {
    // There's already a running game loop with this unique id.
    return;
  }
  sims_[unique_id] = sim;
  std::thread game_loop(&MassServer::run_game_loop_until_stale, this,
                        unique_id);
}

void MassServer::run_game_loop_until_stale(string unique_id) {
  auto sim = sims_[unique_id];
  if (sim == nullptr) {
    cout << "Game loop failed to start. Simulation not populated." << endl;
    return;
  }

  cout << "Running game loop." << endl;
  using clock = std::chrono::high_resolution_clock;
  auto time_start = clock::now();
  std::chrono::nanoseconds unsimulated_elapsed(0);

  const int timestep_millis = 250;
  const std::chrono::milliseconds timestep(timestep_millis);

  while (!sim->is_stale()) {
    auto delta_time = clock::now() - time_start;
    unsimulated_elapsed +=
        std::chrono::duration_cast<std::chrono::nanoseconds>(delta_time);
    while (unsimulated_elapsed < timestep) {
      cout << "Stepping simulation" << endl;
      sim->step(timestep_millis / 1000.0);
    }
    sleep_for(timestep);
  }
  const std::lock_guard<std::mutex> lock(sim_map_modification_mutex_);
  sims_.erase(unique_id);
}
api::VesselUpdate MassServer::get_update_for(std::string scenario_unique_id,
                                             std::string vessel_unique_id) {
  const std::lock_guard<std::mutex> lock(sim_map_modification_mutex_);
  auto sim = sims_[scenario_unique_id];
  return sim->get_update_for(vessel_unique_id);
}
