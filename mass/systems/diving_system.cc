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

using namespace mass::systems;

DivingSystem::DivingSystem(api::DivingSystem diving_system)
    : max_depth_feet(diving_system.max_depth_feet()),
      feet_per_second(diving_system.feet_per_second()) {
  actual_depth_feet = 0;
  requested_depth_feet = 0;
}

void DivingSystem::setup_spawn_state(api::SpawnedVessel) {
  // Nothing to do until we get the ability to spawn vessels at depth.
}
