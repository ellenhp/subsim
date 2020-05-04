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

#include "diving_system.hh"

#include "mass/vessel/hull_system.hh"
#include "mass/vessel/sim_vessel.hh"

using namespace mass::vessel;

DivingSystem::DivingSystem(api::DivingSystem diving_system)
    : max_depth_feet_(diving_system.max_depth_feet()),
      feet_per_second_(diving_system.feet_per_second()) {
  requested_depth_feet_ = 0;
}

void DivingSystem::setup_spawn_state(api::SpawnedVessel spawn_state) {
  // Nothing to do until we get the ability to spawn vessels at depth.
}

void DivingSystem::step(float dt, SimVessel& parent) {
  const double actual_depth_feet = parent.system<HullSystem>()->depth_feet();
  double delta = requested_depth_feet_ - actual_depth_feet;
  double max_delta_this_step = abs(dt * feet_per_second_);

  // If we can get to the requested depth in this step, great.
  if (abs(delta) <= max_delta_this_step) {
    parent.system<HullSystem>()->set_depth_feet(requested_depth_feet_);
  } else {
    parent.system<HullSystem>()->set_depth_feet(
        actual_depth_feet + signum(delta) * max_delta_this_step);
  }
}

void DivingSystem::populate_system_update(api::SystemUpdate* system_update) {
  api::DivingSystemUpdate* update = system_update->mutable_diving_update();
  update->set_requested_depth_feet(requested_depth_feet_);
}
