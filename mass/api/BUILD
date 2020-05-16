load("@rules_java//java:defs.bzl", "java_proto_library")
load("@rules_proto//proto:defs.bzl", "proto_library")
load("@npm_bazel_labs//:index.bzl", "ts_proto_library")
load("@grpc_java//:java_grpc_library.bzl", "java_grpc_library")

package(default_visibility = ["//visibility:public"])

proto_library(
    name = "actions_proto",
    srcs = ["actions.proto"],
    deps = [
        ":chat_proto",
        ":spatial_proto",
        ":weapons_proto",
    ],
)

java_proto_library(
    name = "java_actions_proto",
    deps = [":actions_proto"],
)

ts_proto_library(
    name = "ts_actions_proto",
    proto = ":actions_proto",
)

proto_library(
    name = "chat_proto",
    srcs = ["chat.proto"],
)

java_proto_library(
    name = "java_chat_proto",
    deps = [":chat_proto"],
)

ts_proto_library(
    name = "ts_chat_proto",
    proto = ":chat_proto",
)

proto_library(
    name = "mass_proto",
    srcs = ["mass.proto"],
    deps = [
        ":actions_proto",
        ":scenario_proto",
        ":updates_proto",
    ],
)

java_proto_library(
    name = "java_mass_proto",
    deps = [":mass_proto"],
)

java_grpc_library(
    name = "java_mass_grpc",
    srcs = [":mass_proto"],
    deps = [
        ":java_mass_proto",
    ],
)

ts_proto_library(
    name = "ts_mass_proto",
    proto = ":mass_proto",
)

proto_library(
    name = "scenario_proto",
    srcs = ["scenario.proto"],
    deps = [
        ":spatial_proto",
        ":systems_proto",
    ],
)

java_proto_library(
    name = "java_scenario_proto",
    deps = [":scenario_proto"],
)

ts_proto_library(
    name = "ts_scenario_proto",
    proto = ":scenario_proto",
)

proto_library(
    name = "spatial_proto",
    srcs = ["spatial.proto"],
)

java_proto_library(
    name = "java_spatial_proto",
    deps = [":spatial_proto"],
)

ts_proto_library(
    name = "ts_spatial_proto",
    proto = ":spatial_proto",
)

proto_library(
    name = "systems_proto",
    srcs = ["systems.proto"],
    deps = [
        ":weapons_proto",
    ],
)

java_proto_library(
    name = "java_systems_proto",
    deps = [":systems_proto"],
)

ts_proto_library(
    name = "ts_systems_proto",
    proto = ":systems_proto",
)

proto_library(
    name = "updates_proto",
    srcs = ["updates.proto"],
    deps = [
        ":chat_proto",
        ":spatial_proto",
        ":weapons_proto",
    ],
)

java_proto_library(
    name = "java_updates_proto",
    deps = [":updates_proto"],
)

ts_proto_library(
    name = "ts_updates_proto",
    proto = ":updates_proto",
)

proto_library(
    name = "weapons_proto",
    srcs = ["weapons.proto"],
    deps = [],
)

java_proto_library(
    name = "java_weapons_proto",
    deps = [":weapons_proto"],
)

ts_proto_library(
    name = "ts_weapons_proto",
    proto = ":weapons_proto",
)
