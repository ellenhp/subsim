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

#include "propulsion_system.hh"

#include <cmath>

#include "mass/vessel/map_system.hh"
#include "mass/vessel/sim_vessel.hh"
#include "mass/vessel/steering_system.hh"

using namespace mass::vessel;

template <typename T>
static int signum(T val) {
  return (T(0) < val) - (val < T(0));
}

PropulsionSystem::PropulsionSystem(api::PropulsionSystem propulsion_system)
    : max_speed_knots_(propulsion_system.max_speed_knots()),
      knots_per_second_(propulsion_system.knots_per_second()) {
  requested_speed_knots_ = 0;
  actual_speed_knots_ = 0;
}

void PropulsionSystem::setup_spawn_state(api::SpawnedVessel spawned_vessel) {
  // Nothing to do here until we can spawn vessels at speed.
}

void PropulsionSystem::step(float dt, SimVessel& parent) {
  update_speed(dt, parent);
  update_position(dt, parent);
}

void PropulsionSystem::update_speed(float dt, SimVessel& parent) {
  double delta = requested_speed_knots_ - actual_speed_knots_;
  double max_delta_this_step = abs(dt * knots_per_second_);

  // If we can get to the requested speed in this step, great.
  if (abs(delta) <= max_delta_this_step) {
    actual_speed_knots_ = requested_speed_knots_;
  } else {
    actual_speed_knots_ += signum(delta) * max_delta_this_step;
  }
}

void PropulsionSystem::update_position(float dt, SimVessel& parent) {
  double heading_degrees = parent.system<SteeringSystem>()->heading_degrees();
  api::Position position = parent.position();

  // We'll need this later, compute it now for clarity :)
  double absolute_latitude_radians = position.lat() / 180 * M_PI;

  // Determine the components of the velocity in a locally cartesian X-Y
  // grid, in knots.
  double heading_radians = heading_degrees / 180 * M_PI;
  // A heading of zero is due north, so we need to use sin for X and cos for Y.
  double x_knots = actual_speed_knots_ * sin(heading_radians);
  double y_knots = actual_speed_knots_ * cos(heading_radians);

  // One knot is 1 nmi / hr, which approximates to one minute of latitude / hr.
  double lat_minutes_per_hour = y_knots;
  // Longitudinal speed depends on our absolute latitude.
  double lng_minutes_per_hour = x_knots * cos(absolute_latitude_radians);

  api::Position new_position;
  // 60 minutes (of angle) per degree, 3600 seconds (of time) per hour.
  new_position.set_lat(position.lat() + dt * lat_minutes_per_hour / 60 / 3600);
  new_position.set_lng(position.lng() + dt * lng_minutes_per_hour / 60 / 3600);

  parent.set_position(new_position);
}

void PropulsionSystem::populate_system_update(
    api::SystemUpdate* system_update) {
  auto update = system_update->mutable_propulsion_update();
  update->set_actual_speed_knots(actual_speed_knots_);
  update->set_requested_speed_knots(requested_speed_knots_);
}
