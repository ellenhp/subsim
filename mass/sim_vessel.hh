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
#include "systems/sim_system.hh"

namespace mass {
class SimVessel {
 public:
  SimVessel(api::VesselDescriptor descriptor);

  template <class T>
  std::shared_ptr<T> get_system_of_type();

  template <class T>
  std::vector<std::shared_ptr<T>> get_all_systems_of_type();

 private:
  std::set<std::shared_ptr<systems::SimSystem>> vessel_systems;
};
}  // namespace mass
