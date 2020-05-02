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

#include "steering_system.hh"

#include <random>

using namespace mass::systems;

SteeringSystem::SteeringSystem(api::SteeringSystem steering_system)
    : degrees_per_second_max(steering_system.degrees_per_second()) {
  actual_heading = 0;
  requested_heading = 0;
}

void SteeringSystem::setup_spawn_state(api::SpawnedVessel spawned_vessel) {
  // Catch all cases where the exact_spawn_heading is set and is non-default. We
  // don't need to catch (and *can't* catch cases where it's set to default).
  if (spawned_vessel.spawn_info().exact_spawn_heading() != 0) {
    actual_heading = requested_heading =
        spawned_vessel.spawn_info().exact_spawn_heading();
  } else if (spawned_vessel.spawn_info().has_heading_bounds()) {
    api::HeadingBounds heading_bounds =
        spawned_vessel.spawn_info().heading_bounds();
    std::random_device random_device;
    std::mt19937 engine(random_device());
    // Add 360 to the right bound in case it wraps around across zero.
    std::uniform_int_distribution<> heading_dist(
        heading_bounds.left_bound(), heading_bounds.right_bound() + 360);
    actual_heading = requested_heading = heading_dist(engine) % 360;
  }
}

double SteeringSystem::heading_degrees() { return actual_heading; }
