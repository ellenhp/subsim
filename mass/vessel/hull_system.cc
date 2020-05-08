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

#include "hull_system.hh"

using namespace mass::vessel;

HullSystem::HullSystem(api::HullSystem hull_system)
    : draft_surfaced_(hull_system.draft_surfaced()),
      depth_feet_(hull_system.draft_surfaced()) {}

void HullSystem::setup_spawn_state(api::SpawnedVessel spawned_vessel) {}

double HullSystem::depth_feet() { return depth_feet_; }

void HullSystem::set_depth_feet(double new_depth) { depth_feet_ = new_depth; }

void HullSystem::populate_system_update(api::SystemUpdate* system_update) {
  system_update->mutable_hull_update()->set_actual_depth_feet(depth_feet_);
}

void HullSystem::process_system_request(api::SystemRequest system_request) {
  // No-op for now.
}
