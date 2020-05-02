load("@rules_cc//cc:defs.bzl", "cc_library")

cc_library(
    name = "systems",
    srcs = glob(
        ["*.cc"],
    ),
    hdrs = glob(
        ["*.hh"],
    ),
    visibility = ["//visibility:public"],
    deps = [
        "//mass/api:cc_scenario_proto",
        "//mass/api:cc_systems_proto",
    ],
)
