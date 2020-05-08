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
    grpc::ServerContext *context, const ::api::ConnectRequest *request,
    grpc::ServerWriter<api::VesselUpdate> *stream) {
  string scenario_id = request->scenario_id();
  cout << "Maybe starting game loop." << endl;
  server_->run_game_loop_nonblocking(make_shared<Sim>(request->scenario()),
                                     request->scenario_id());
  server_->get_update_for(scenario_id, request->vessel_unique_id());
  api::VesselUpdate update;
  cout << "Writing update." << endl;
  while (stream->Write(
      server_->get_update_for(scenario_id, request->vessel_unique_id()))) {
    sleep_for(std::chrono::milliseconds(1000));
    cout << "Writing update." << endl;
  }
  cout << "Wrote last update." << endl;
  return grpc::Status::OK;
}

grpc::Status MassBackendImpl::DoAction(grpc::ServerContext *context,
                                       const ::api::DoActionRequest *request,
                                       api::DoActionResponse *response) {
  server_->push_request(*request);
  return grpc::Status::OK;
}

MassServer::MassServer(std::string server_address_and_port)
    : server_address_and_port_(server_address_and_port),
      shutting_down_(false) {}

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
  cout << "Server shutting down." << endl;
  shutting_down_ = true;
}

void MassServer::run_game_loop_nonblocking(std::shared_ptr<Sim> sim,
                                           std::string unique_id) {
  const std::lock_guard<std::mutex> lock(sim_map_modification_mutex_);
  if (sims_.find(unique_id) != sims_.end()) {
    // There's already a running game loop with this unique id.
    return;
  }
  sims_[unique_id] = sim;
  cout << "Starting game loop thread." << endl;
  the_place_where_threads_go_to_die_.push_back(
      std::thread(&MassServer::run_game_loop_until_stale, this, unique_id));
  cout << "Started thread." << endl;
}

void MassServer::run_game_loop_until_stale(string unique_id) {
  cout << "Running game loop until stale." << endl;
  std::shared_ptr<Sim> sim = nullptr;
  {
    const std::lock_guard<std::mutex> lock(sim_map_modification_mutex_);
    if (sims_.find(unique_id) == sims_.end()) {
      cout << "Game loop failed to start. Simulation not populated." << endl;
      return;
    }
    cout << "Found simulation to run." << endl;
    sim = sims_[unique_id];
  }

  cout << "Running game loop." << endl;
  using clock = std::chrono::high_resolution_clock;
  auto time_start = clock::now();
  std::chrono::milliseconds unsimulated_elapsed(0);

  const int timestep_millis = 1000;
  const std::chrono::milliseconds timestep(timestep_millis);

  while (!shutting_down_ && !sim->is_stale()) {
    auto delta_time = clock::now() - time_start;
    unsimulated_elapsed +=
        std::chrono::duration_cast<std::chrono::milliseconds>(delta_time);
    while (unsimulated_elapsed > timestep) {
      sim->step(timestep_millis / 1000.0);
      unsimulated_elapsed -= timestep;
    }
    cout << "Sleeping in game loop" << endl;
    sleep_for(timestep);
  }
  const std::lock_guard<std::mutex> lock(sim_map_modification_mutex_);
  // TODO there's a race condition here somewhere a new client connecting and a
  // world being destroyed for being stale.
  if (sim->is_stale()) {
    sims_.erase(unique_id);
  }
}
api::VesselUpdate MassServer::get_update_for(std::string scenario_unique_id,
                                             std::string vessel_unique_id) {
  const std::lock_guard<std::mutex> lock(sim_map_modification_mutex_);
  if (sims_.find(scenario_unique_id) != sims_.end()) {
    return sims_[scenario_unique_id]->get_update_for(vessel_unique_id);
  }
  return api::VesselUpdate();
}

void MassServer::push_request(api::DoActionRequest request) {
  const std::lock_guard<std::mutex> lock(sim_map_modification_mutex_);
  if (sims_.find(request.scenario_id()) == sims_.end()) {
    return;
  }
  sims_[request.scenario_id()]->process_request(request);
}
