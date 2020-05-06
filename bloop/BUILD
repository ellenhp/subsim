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
load("@io_bazel_rules_docker//python3:image.bzl", "py3_image")
load("@io_bazel_rules_docker//docker/package_managers:download_pkgs.bzl", "download_pkgs")
load("@io_bazel_rules_docker//docker/package_managers:install_pkgs.bzl", "install_pkgs")
load("@io_bazel_rules_docker//container:container.bzl", "container_image")

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

download_pkgs(
    name = "python3_packages",
    image_tar = "@ubuntu2004//image",
    packages = [
        "libgfortran5",
        "python",
        "python3",
    ],
)

install_pkgs(
    name = "python3_packages_install",
    image_tar = "@ubuntu2004//image",
    installables_tar = ":python3_packages.tar",
    output_image_name = "python3_alpine_linux",
)

container_image(
    name = "python3_packages_install_wrapper",
    base = ":python3_packages_install.tar",
    files = [
        "//acoustics/bellhop:bellhop.exe",
    ],
    symlinks = {
        "/bin/bellhop.exe": "/bellhop.exe",
    },
)

py3_image(
    name = "bloop_service_test_image",
    srcs = [
        "bloop_service.py",
        "bloop_service_test.py",
    ],
    base = ":python3_packages_install_wrapper",
    layers = [
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
    main = "bloop_service_test.py",
    # entrypoint = [
    #     "python3",
    #     "/bloop_service_test.py",
    # ],
    # files = [
    #     ":bloop_service",
    #     ":bloop_service_test",
    #     "//acoustics/bellhop:bellhop.exe",
    #     "//bloop/api:py_bloop_grpc",
    #     "//bloop/api:py_bloop_proto",
    # ],
    deps = [
        ":bloop_service",
        ":bloop_service_test",
        "//bloop/api:py_bloop_grpc",
        "//bloop/api:py_bloop_proto",
    ],
    # symlinks = {
    #     "/bin/bellhop.exe": "/bellhop.exe",
    #     "/bloop/api/bloop_pb2_grpc.py": "/bloop_pb2_grpc.py",
    #     "/bloop/api/bloop_pb2.py": "/bloop_pb2.py",
    # },
)
