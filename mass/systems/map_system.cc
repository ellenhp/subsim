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

#include "map_system.hh"

#include <random>

using namespace mass::systems;

MapSystem::MapSystem(api::MapSystem) {}

void MapSystem::setup_spawn_state(api::SpawnedVessel spawned_vessel) {
  if (spawned_vessel.spawn_info().has_position()) {
    position = spawned_vessel.spawn_info().position();
  } else if (spawned_vessel.spawn_info().has_bounds()) {
    api::Bounds bounds = spawned_vessel.spawn_info().bounds();
    std::random_device random_device;
    std::mt19937 engine(random_device());
    std::uniform_real_distribution<> lat_dist(bounds.south_west().lat(),
                                              bounds.north_east().lat());
    std::uniform_real_distribution<> lng_dist(bounds.south_west().lng(),
                                              bounds.north_east().lng());
    position.set_lat(lat_dist(engine));
    position.set_lng(lng_dist(engine));
  }
}
