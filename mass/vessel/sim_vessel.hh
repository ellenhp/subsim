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

#include <memory>
#include <vector>

#include "mass/api/actions.pb.h"
#include "mass/api/scenario.pb.h"
#include "mass/api/updates.pb.h"

namespace mass {
namespace vessel {
class SimSystem;
class SimVessel {
 public:
  SimVessel(api::VesselDescriptor descriptor, api::SpawnedVessel spawn_info);

  void step(float dt);

  api::VesselUpdate get_update();
  void process_request(api::DoActionRequest request);

  template <class T>
  std::shared_ptr<T> system() {
    auto results = all_systems<T>();
    // We can't return a single system if there are multiple or none.
    if (results.size() == 1) {
      return results[0];
    }
    return nullptr;
  }

  template <class T>
  std::vector<std::shared_ptr<T>> all_systems() {
    std::vector<std::shared_ptr<T>> results;
    for (std::shared_ptr<SimSystem> system : vessel_systems) {
      std::shared_ptr<T> cast_ptr = std::dynamic_pointer_cast<T>(system);
      if (cast_ptr != nullptr) {
        results.push_back(cast_ptr);
      }
    }
    return results;
  }

  api::Position position() const;
  void set_position(api::Position);

 private:
  api::Position position_;
  std::vector<std::shared_ptr<SimSystem>> vessel_systems;
};
}  // namespace vessel
}  // namespace mass
