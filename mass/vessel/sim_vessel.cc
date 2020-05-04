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
  for (shared_ptr<SimSystem> system : vessel_systems) {
    api::SystemUpdate* system_update = update.add_system_updates();
    system->populate_system_update(system_update);
  }
  // TODO eventually do chat updates!
  return update;
}

api::Position SimVessel::position() const { return position_; }

void SimVessel::set_position(api::Position new_position) {
  position_ = new_position;
}
