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

#pragma once

#include "mass/api/systems.pb.h"
#include "sim_system.hh"

namespace mass {
namespace vessel {
class PropulsionSystem : public SimSystem {
 public:
  PropulsionSystem(api::PropulsionSystem propulsion_system);

  virtual void setup_spawn_state(api::SpawnedVessel spawned_state) override;
  virtual void populate_system_update(
      api::SystemUpdate* system_update) override;

  virtual void step(float dt, SimVessel& parent) override;

 private:
  void update_speed(float dt, SimVessel& parent);
  void update_position(float dt, SimVessel& parent);

  const uint32_t max_speed_knots_;
  const double knots_per_second_;

  uint32_t requested_speed_knots_;
  double actual_speed_knots_;
};
}  // namespace vessel
}  // namespace mass
