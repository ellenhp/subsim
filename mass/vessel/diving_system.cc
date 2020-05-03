// Copyright 2020 Ellen Poe
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
