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

load("@io_bazel_rules_docker//container:container.bzl", "container_image", "container_push")
load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")
load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")
load("@rules_python//python:defs.bzl", "py_binary")
load("@bloop_deps//:requirements.bzl", "requirement")
load("@io_bazel_rules_docker//python3:image.bzl", "py3_image")
load("@io_bazel_rules_docker//docker/package_managers:download_pkgs.bzl", "download_pkgs")
load("@io_bazel_rules_docker//docker/package_managers:install_pkgs.bzl", "install_pkgs")

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
    name = "python3_ubuntu2004_packages",
    image_tar = "@ubuntu2004//image",
    packages = [
        "libgfortran5",
        "python",
        "python3",
    ],
)

install_pkgs(
    name = "python3_ubuntu2004",
    image_tar = "@ubuntu2004//image",
    installables_tar = ":python3_ubuntu2004_packages.tar",
    output_image_name = "python3_ubuntu2004",
)

container_image(
    name = "python3_ubuntu2004_wrapper_with_bellhop",
    base = ":python3_ubuntu2004.tar",
    files = [
        "//acoustics/bellhop:bellhop",
    ],
    symlinks = {
        "/bin/bellhop.exe": "/bellhop.exe",
    },
)

py3_image(
    name = "image",
    srcs = [
        "bloop_service.py",
    ],
    base = ":python3_ubuntu2004_wrapper_with_bellhop",
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
    main = "bloop_service.py",
    deps = [
        ":bloop_service",
        "//bloop/api:py_bloop_grpc",
        "//bloop/api:py_bloop_proto",
    ],
)

k8s_objects(
    name = "prod",
    objects = [
        ":prod-deployment",
        ":prod-service",
    ],
    visibility = ["//k8s:__subpackages__"],
)

k8s_object(
    name = "prod-deployment",
    cluster = "gke_mass-276203_us-central1-c_milky",
    images = {
        "gcr.io/mass-276203/bloop:dev": "//bloop:image",
    },
    kind = "deployment",
    template = ":deployment.yaml",
)

k8s_object(
    name = "prod-service",
    cluster = "gke_mass-276203_us-central1-c_milky",
    kind = "service",
    template = ":service.yaml",
)

k8s_objects(
    name = "dev",
    objects = [
        ":dev-deployment",
        ":dev-service",
    ],
    visibility = ["//k8s:__subpackages__"],
)

k8s_object(
    name = "dev-deployment",
    cluster = "mass-dev",
    images = {
        "gcr.io/mass-276203/bloop:dev": "//bloop:image",
    },
    kind = "deployment",
    template = ":deployment.yaml",
)

k8s_object(
    name = "dev-service",
    cluster = "mass-dev",
    kind = "service",
    template = ":service.yaml",
)

container_push(
    name = "publish",
    format = "Docker",
    image = ":image",
    registry = "gcr.io",
    repository = "mass-276203/bloop",
    tag = "dev",
)
