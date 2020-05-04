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

load("@rules_python//python:defs.bzl", "py_binary")
load("@bloop_deps//:requirements.bzl", "requirement")

py_binary(
    name = "bloop_service",
    srcs = ["bloop_service.py"],
    python_version = "PY3",
    deps = [
        "//bloop/api:py_bloop_grpc",
        "//bloop/api:py_bloop_proto",
        requirement("arlpy"),
        requirement("bokeh"),
        requirement("six"),
        requirement("tornado"),
        requirement("typing-extensions"),
        requirement("utm"),
        requirement("PyYAML"),
        requirement("python-dateutil"),
        requirement("pyparsing"),
        requirement("Pillow"),
        requirement("pandas"),
        requirement("packaging"),
        requirement("numpy"),
        requirement("pytz"),
        requirement("MarkupSafe"),
        requirement("Jinja2"),
    ],
)

py_binary(
    name = "bloop_service_test",
    srcs = ["bloop_service_test.py"],
    python_version = "PY3",
    deps = [
        "//bloop/api:py_bloop_grpc",
        "//bloop/api:py_bloop_proto",
        requirement("arlpy"),
        requirement("bokeh"),
        requirement("six"),
        requirement("tornado"),
        requirement("typing-extensions"),
        requirement("utm"),
        requirement("PyYAML"),
        requirement("python-dateutil"),
        requirement("pyparsing"),
        requirement("Pillow"),
        requirement("pandas"),
        requirement("packaging"),
        requirement("numpy"),
        requirement("pytz"),
        requirement("MarkupSafe"),
        requirement("Jinja2"),
    ],
)
