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
