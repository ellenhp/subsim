load("@rules_cc//cc:defs.bzl", "cc_library")

cc_library(
    name = "vessel",
    srcs = glob(
        ["*.cc"],
    ),
    hdrs = glob(
        ["*.hh"],
    ),
    copts = [
        "-pedantic",
    ],
    visibility = ["//visibility:public"],
    deps = [
        "//mass/api:cc_actions_proto",
        "//mass/api:cc_scenario_proto",
        "//mass/api:cc_systems_proto",
        "//mass/api:cc_updates_proto",
    ],
)
