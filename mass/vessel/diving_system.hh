// Copyright (C) 2020 Ellen Poe
//
// This file is part of MASS.
//
// MASS is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// MASS is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with MASS.  If not, see <http://www.gnu.org/licenses/>.

#pragma once

#include "mass/api/systems.pb.h"
#include "mass/vessel/sim_system.hh"
#include "mass/vessel/sim_vessel.hh"

namespace mass {
namespace vessel {
class DivingSystem : public SimSystem {
 public:
  DivingSystem(api::DivingSystem diving_system);

  virtual void setup_spawn_state(api::SpawnedVessel spawned_state) override;
  virtual void populate_system_update(
      api::SystemUpdate* system_update) override;

  virtual void step(float dt, SimVessel& parent) override;

 private:
  const uint32_t max_depth_feet_;
  const double feet_per_second_;

  uint32_t requested_depth_feet_;
};
}  // namespace vessel
}  // namespace mass
