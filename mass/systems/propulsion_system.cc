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

#include "propulsion_system.hh"

using namespace mass::systems;

PropulsionSystem::PropulsionSystem(api::PropulsionSystem propulsion_system)
    : max_speed_knots(propulsion_system.max_speed_knots()) {
  requested_speed_knots = 0;
  actual_speed_knots = 0;
}

void PropulsionSystem::setup_spawn_state(api::SpawnedVessel spawned_vessel) {
  // Nothing to do here until we can spawn vessels at speed.
}
