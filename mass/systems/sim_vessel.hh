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

#pragma once

#include <memory>
#include <set>
#include <vector>

#include "mass/api/scenario.pb.h"
#include "mass/api/updates.pb.h"

namespace mass {
namespace systems {
class SimSystem;
class SimVessel {
 public:
  SimVessel(api::VesselDescriptor descriptor, api::SpawnedVessel spawn_info);

  void step(float dt);

  api::VesselUpdate get_update();

  template <class T>
  std::shared_ptr<T> system();

  template <class T>
  std::vector<std::shared_ptr<T>> all_systems();

  api::Position position() const;
  void set_position(api::Position);

 private:
  api::Position position_;
  std::set<std::shared_ptr<SimSystem>> vessel_systems;
};
}  // namespace systems
}  // namespace mass
