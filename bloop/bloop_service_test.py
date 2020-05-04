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

from bloop_service import start
from bloop.api import bloop_pb2_grpc, bloop_pb2
import grpc

print("Starting server")
start(False)
print("Started server")

channel = grpc.insecure_channel('localhost:50051')
stub = bloop_pb2_grpc.BloopStub(channel)

print()
request = bloop_pb2.PropagateRequest()

request.ranges.append(100)
request.depths.append(10)

bathymetry = bloop_pb2.BathymetricProfile()
for i in [0, 20000]:
  point = bloop_pb2.BathymetricProfile.BathymetricProfilePoint()
  point.depth_meters = 25
  point.range_meters = i
  request.bathymetry.points.append(point)

request.frequency = 200

feature = stub.Propagate(request)
