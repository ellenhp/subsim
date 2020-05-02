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

#include "sim.hh"

using namespace mass;
using std::string;

Sim::Sim(api::Scenario scenario) {
  for (auto &descriptor : scenario.vessel_descriptors()) {
    vessel_descriptors_[descriptor.unique_id()] = descriptor;
  }
  for (auto &spanwed_vessel : scenario.vessels()) {
    string id = spanwed_vessel.unique_id();
    vessels_[id] = std::make_shared<vessel::SimVessel>(
        vessel_descriptors_[spanwed_vessel.vessel_descriptor_id()],
        spanwed_vessel);
  }
}

void Sim::step(float dt) {
  const std::lock_guard<std::mutex> lock(sim_mutex_);
  for (auto &id_and_vessel : vessels_) {
    id_and_vessel.second->step(dt);
  }
}

api::VesselUpdate Sim::get_update_for(std::string vessel_unique_id) {
  const std::lock_guard<std::mutex> lock(sim_mutex_);
  return vessels_[vessel_unique_id]->get_update();
}

bool Sim::is_stale() { return false; }
