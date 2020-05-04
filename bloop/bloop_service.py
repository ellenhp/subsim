# Copyright (C) 2020 Ellen Poe
# 
# This file is part of MASS.
# 
# MASS is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# MASS is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with MASS.  If not, see <http://www.gnu.org/licenses/>.

from bloop.api import bloop_pb2_grpc
import grpc
import concurrent.futures as futures
import arlpy.uwapm as pm
import numpy as np

class BloopServicer(bloop_pb2_grpc.BloopServicer):
  def Propagate(self, request, context):
    bathymetry = [[point.range_meters, point.depth_meters] for point in request.bathymetry.points]
    print(bathymetry)
    env = pm.create_env2d(rx_range=np.asarray(request.ranges),
                          rx_depth=np.asarray(request.depths),
                          # depth=bathymetry,
                          frequency=request.frequency)
    # env = pm.create_env2d(rx_range=100, frequency=200)
    tloss = pm.compute_transmission_loss(env, mode=pm.incoherent)
    print(tloss)
    print(request)

def start(should_wait = True):
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=30))
  bloop_pb2_grpc.add_BloopServicer_to_server(BloopServicer(), server)
  server.add_insecure_port('[::]:50051')
  server.start()
  if (should_wait):
    server.wait_for_termination()

if __name__ == "main": 
  start()
