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
from multiprocessing import Process


def start_server():
  print("Starting server")
  p = Process(target=start, args=('False',))
  p.start()
  print("Started server")
  return p

def make_request():
  request = bloop_pb2.PropagateRequest()

  request.ranges.append(100)
  request.ranges.append(200)
  request.depths.append(10)

  bathymetry = bloop_pb2.BathymetricProfile()
  for i in [-1, 20000]: # For some reason there has to be a point with negative range.
    point = bloop_pb2.BathymetricProfile.BathymetricProfilePoint()
    point.depth_meters = 25
    point.range_meters = i
    request.bathymetry.points.append(point)

  request.frequency = 200
  return request

def get_stub():
  channel = grpc.insecure_channel('0.0.0.0:50051')
  stub = bloop_pb2_grpc.BloopStub(channel)
  return stub

process = start_server()
stub = get_stub()

import timeit
times = 5
t = timeit.timeit('stub.Propagate(make_request())', '''
from __main__ import get_stub, make_request, start_server
stub=get_stub()
''', number=times)
print('RPC time: {}'.format(t/times))

print(stub.Propagate(make_request()))

process.terminate()
