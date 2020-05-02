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

#include "hull_system.hh"

using namespace mass::systems;

HullSystem::HullSystem(api::HullSystem hull_system)
    : draft_surfaced_(hull_system.draft_surfaced()) {}

void HullSystem::setup_spawn_state(api::SpawnedVessel spawned_vessel) {}

double HullSystem::depth_feet() { return depth_feet_; }

void HullSystem::set_depth_feet(double new_depth) { depth_feet_ = new_depth; }
