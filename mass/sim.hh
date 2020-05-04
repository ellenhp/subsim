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

#include <map>
#include <mutex>
#include <string>

#include "mass/api/actions.pb.h"
#include "mass/api/mass.pb.h"
#include "mass/api/scenario.pb.h"
#include "mass/api/updates.pb.h"
#include "mass/vessel/sim_vessel.hh"

namespace mass {
class Sim {
 public:
  Sim(api::Scenario scenario);

  void process_request(api::DoActionRequest mass_request);

  void step(float dt);

  api::VesselUpdate get_update_for(std::string vessel_unique_id);

  bool is_stale();

 private:
  std::mutex sim_mutex_;

  std::map<std::string, std::shared_ptr<vessel::SimVessel>> vessels_;
  std::map<std::string, api::VesselDescriptor> vessel_descriptors_;
};
}  // namespace mass
