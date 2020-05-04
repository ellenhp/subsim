load("@rules_cc//cc:defs.bzl", "cc_binary", "cc_library")
load("@io_bazel_rules_docker//cc:image.bzl", "cc_image")

cc_image(
    name = "image",
    base = "@alpine_linux_amd64//image",
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
    deps = [":server"],
)
