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

#include "sim_vessel.hh"

#include <random>

#include "mass/vessel/diving_system.hh"
#include "mass/vessel/map_system.hh"
#include "mass/vessel/propulsion_system.hh"
#include "mass/vessel/sim_system.hh"
#include "mass/vessel/steering_system.hh"

using namespace mass::vessel;
using std::make_shared;
using std::shared_ptr;
using std::static_pointer_cast;

SimVessel::SimVessel(api::VesselDescriptor vessel_descriptor,
                     api::SpawnedVessel spawned_vessel) {
  for (auto& system : vessel_descriptor.systems()) {
    shared_ptr<SimSystem> new_system = nullptr;
    if (system.has_steering_system()) {
      new_system = static_pointer_cast<SimSystem>(
          make_shared<SteeringSystem>(system.steering_system()));
    } else if (system.has_diving_system()) {
      new_system = static_pointer_cast<SimSystem>(
          make_shared<DivingSystem>(system.diving_system()));
    } else if (system.has_propulsion_system()) {
      new_system = static_pointer_cast<SimSystem>(
          make_shared<PropulsionSystem>(system.propulsion_system()));
    } else if (system.has_map_system()) {
      new_system = static_pointer_cast<SimSystem>(
          make_shared<MapSystem>(system.map_system()));
    }
    vessel_systems.insert(new_system);
  }

  if (spawned_vessel.spawn_info().has_position()) {
    position_ = spawned_vessel.spawn_info().position();
  } else if (spawned_vessel.spawn_info().has_bounds()) {
    api::Bounds bounds = spawned_vessel.spawn_info().bounds();
    std::random_device random_device;
    std::mt19937 engine(random_device());
    std::uniform_real_distribution<> lat_dist(bounds.south_west().lat(),
                                              bounds.north_east().lat());
    std::uniform_real_distribution<> lng_dist(bounds.south_west().lng(),
                                              bounds.north_east().lng());
    position_.set_lat(lat_dist(engine));
    position_.set_lng(lng_dist(engine));
  }
}

void SimVessel::step(float dt) {
  for (shared_ptr<SimSystem> system : vessel_systems) {
    system->step(dt, *this);
  }
}

api::VesselUpdate SimVessel::get_update() {
  api::VesselUpdate update;
  return update;
}

api::Position SimVessel::position() const { return position_; }

void SimVessel::set_position(api::Position new_position) {
  position_ = new_position;
}
