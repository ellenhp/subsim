load("@rules_cc//cc:defs.bzl", "cc_binary", "cc_library")

cc_library(
    name = "server",
    srcs = ["server.cc"],
    hdrs = ["server.hh"],
    deps = [
        "//mass/api:cc_mass_grpc",
        "@com_github_grpc_grpc//:grpc++_base",
        "@com_github_grpc_grpc//:grpc++_reflection",
    ],
)

cc_binary(
    name = "mass",
    srcs = ["main.cc"],
    deps = [":server"],
)
