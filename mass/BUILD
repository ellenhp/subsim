load("@rules_cc//cc:defs.bzl", "cc_binary", "cc_library")
load("@io_bazel_rules_docker//cc:image.bzl", "cc_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")
load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")
load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")

package(default_visibility = ["//k8s:__subpackages__"])

k8s_objects(
    name = "prod",
    objects = [
        ":prod-deployment",
        ":prod-service",
    ],
)

k8s_object(
    name = "prod-deployment",
    cluster = "gke_mass-276203_us-central1-c_milky",
    images = {
        "gcr.io/mass-276203/mass:dev": "//mass:image",
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

container_push(
    name = "publish",
    format = "Docker",
    image = ":image",
    registry = "gcr.io",
    repository = "mass-276203/mass",
    tag = "dev",
)

cc_image(
    name = "image",
    binary = ":mass",
)

cc_library(
    name = "server",
    srcs = glob(
        ["*.cc"],
        exclude = ["main.cc"],
    ),
    hdrs = glob(
        ["*.hh"],
    ),
    copts = [
        "-pedantic",
    ],
    deps = [
        "//mass/api:cc_mass_grpc",
        "//mass/api:cc_scenario_proto",
        "//mass/api:cc_spatial_proto",
        "//mass/api:cc_systems_proto",
        "//mass/vessel",
        "@com_github_grpc_grpc//:grpc++_base",
        "@com_github_grpc_grpc//:grpc++_reflection",
    ],
)

cc_binary(
    name = "mass",
    srcs = ["main.cc"],
    copts = [
        "-pedantic",
    ],
    deps = [":server"],
)
