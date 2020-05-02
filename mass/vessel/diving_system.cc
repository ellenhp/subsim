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

#include "diving_system.hh"

#include "mass/vessel/hull_system.hh"
#include "mass/vessel/sim_vessel.hh"

using namespace mass::vessel;

template <typename T>
static int signum(T val) {
  return (T(0) < val) - (val < T(0));
}

DivingSystem::DivingSystem(api::DivingSystem diving_system)
    : max_depth_feet(diving_system.max_depth_feet()),
      feet_per_second(diving_system.feet_per_second()) {
  requested_depth_feet = 0;
}

void DivingSystem::setup_spawn_state(api::SpawnedVessel) {
  // Nothing to do until we get the ability to spawn vessels at depth.
}

void DivingSystem::step(float dt, SimVessel& parent) {
  const double actual_depth_feet = parent.system<HullSystem>()->depth_feet();
  double delta = requested_depth_feet - actual_depth_feet;
  double max_delta_this_step = abs(dt * feet_per_second);

  // If we can get to the requested depth in this step, great.
  if (abs(delta) <= max_delta_this_step) {
    parent.system<HullSystem>()->set_depth_feet(requested_depth_feet);
  } else {
    parent.system<HullSystem>()->set_depth_feet(
        actual_depth_feet + signum(delta) * max_delta_this_step);
  }
}
