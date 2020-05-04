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

bool Sim::is_stale() {
  // TODO: return true if we haven't seen a user request in a while.
  return false;
}
