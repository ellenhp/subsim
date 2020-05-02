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

#include "mass/systems/diving_system.hh"
#include "mass/systems/map_system.hh"
#include "mass/systems/propulsion_system.hh"
#include "mass/systems/sim_system.hh"
#include "mass/systems/steering_system.hh"

using namespace mass::systems;
using std::dynamic_pointer_cast;
using std::make_shared;
using std::shared_ptr;
using std::static_pointer_cast;
using std::vector;

SimVessel::SimVessel(api::VesselDescriptor vessel_descriptor,
                     api::SpawnedVessel spawned_vessel) {
  for (auto& system : vessel_descriptor.systems()) {
    shared_ptr<systems::SimSystem> new_system = nullptr;
    if (system.has_steering_system()) {
      new_system = static_pointer_cast<systems::SimSystem>(
          make_shared<systems::SteeringSystem>(system.steering_system()));
    } else if (system.has_diving_system()) {
      new_system = static_pointer_cast<systems::SimSystem>(
          make_shared<systems::DivingSystem>(system.diving_system()));
    } else if (system.has_propulsion_system()) {
      new_system = static_pointer_cast<systems::SimSystem>(
          make_shared<systems::PropulsionSystem>(system.propulsion_system()));
    } else if (system.has_map_system()) {
      new_system = static_pointer_cast<systems::SimSystem>(
          make_shared<systems::MapSystem>(system.map_system()));
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

template <class T>
vector<shared_ptr<T>> SimVessel::all_systems() {
  vector<shared_ptr<T>> results;
  for (shared_ptr<systems::SimSystem> system : vessel_systems) {
    shared_ptr<T> cast_ptr = dynamic_pointer_cast<T>(system);
    if (cast_ptr != nullptr) {
      results.push_back(cast_ptr);
    }
  }
  return results;
}

template <class T>
shared_ptr<T> SimVessel::system() {
  vector<T> results = all_systems<T>();
  // We can't return a single system if there are multiple or none.
  if (results.size() == 1) {
    return results[0];
  }
  return nullptr;
}

void SimVessel::step(float dt) {
  for (shared_ptr<systems::SimSystem> system : vessel_systems) {
    system->step(dt, *this);
  }
}

api::VesselUpdate SimVessel::get_update() {
  api::VesselUpdate update;
  return update;
}
