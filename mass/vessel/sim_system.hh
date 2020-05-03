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

#include "mass/api/scenario.pb.h"
#include "mass/vessel/sim_vessel.hh"

namespace mass {
namespace vessel {
class SimSystem {
 public:
  virtual void setup_spawn_state(api::SpawnedVessel spawned_state) = 0;

  virtual void step(float dt, SimVessel& parent);

  virtual void populate_system_update(api::SystemUpdate* system_update) = 0;

 protected:
  template <typename T>
  static int signum(T val) {
    return (T(0) < val) - (val < T(0));
  }
};
}  // namespace vessel
}  // namespace mass
