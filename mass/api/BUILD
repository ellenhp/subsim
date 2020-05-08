load("@rules_cc//cc:defs.bzl", "cc_proto_library")
load("@rules_proto//proto:defs.bzl", "proto_library")
load("@com_github_grpc_grpc//bazel:cc_grpc_library.bzl", "cc_grpc_library")
load("@io_bazel_grpc_web//bazel:closure_grpc_web_library.bzl", "closure_grpc_web_library")
load("@npm_bazel_typescript//:index.bzl", "ts_library")
load("//workarounds:garbage_rules.bzl", "faked_node_module_library")

package(default_visibility = ["//visibility:public"])

proto_library(
    name = "actions_proto",
    srcs = ["actions.proto"],
    deps = [
        ":chat_proto",
    ],
)

cc_proto_library(
    name = "cc_actions_proto",
    deps = [":actions_proto"],
)

proto_library(
    name = "chat_proto",
    srcs = ["chat.proto"],
)

cc_proto_library(
    name = "cc_chat_proto",
    deps = [":chat_proto"],
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

cc_proto_library(
    name = "cc_mass_proto",
    deps = [":mass_proto"],
)

cc_grpc_library(
    name = "cc_mass_grpc",
    srcs = [":mass_proto"],
    grpc_only = True,
    deps = [
        ":cc_mass_proto",
    ],
)

filegroup(
    name = "all_protos",
    srcs = glob(["*.proto"])
)

genrule(
    name = "ts_mass_proto_gen",
    srcs = [
        ":all_protos",
    ],
    outs = [
        "MassServiceClientPb.ts",
        "actions_pb.d.ts",
        "actions_pb.js",
        "chat_pb.d.ts",
        "chat_pb.js",
        "mass_pb.d.ts",
        "mass_pb.js",
        "scenario_pb.d.ts",
        "scenario_pb.js",
        "spatial_pb.d.ts",
        "spatial_pb.js",
        "systems_pb.d.ts",
        "systems_pb.js",
        "updates_pb.d.ts",
        "updates_pb.js",
    ],
    cmd = "protoc --proto_path=. --js_out=import_style=commonjs,binary:\"$(RULEDIR)/../../\" --grpc-web_out=import_style=typescript,mode=grpcwebtext:\"$(RULEDIR)/../../\" $(locations :all_protos) && echo $(locations :all_protos)"
)

faked_node_module_library(
    name = "ts_mass_proto",
    srcs = [
        ":MassServiceClientPb.ts",
        ":actions_pb.d.ts",
        ":actions_pb.js",
        ":chat_pb.d.ts",
        ":chat_pb.js",
        ":mass_pb.d.ts",
        ":mass_pb.js",
        ":scenario_pb.d.ts",
        ":scenario_pb.js",
        ":spatial_pb.d.ts",
        ":spatial_pb.js",
        ":systems_pb.d.ts",
        ":systems_pb.js",
        ":updates_pb.d.ts",
        ":updates_pb.js",
    ],
    deps = ["@npm//grpc-web", ],
)

proto_library(
    name = "scenario_proto",
    srcs = ["scenario.proto"],
    deps = [
        ":spatial_proto",
        ":systems_proto",
    ],
)

cc_proto_library(
    name = "cc_scenario_proto",
    deps = [":scenario_proto"],
)

proto_library(
    name = "spatial_proto",
    srcs = ["spatial.proto"],
)

cc_proto_library(
    name = "cc_spatial_proto",
    deps = [":spatial_proto"],
)

proto_library(
    name = "systems_proto",
    srcs = ["systems.proto"],
)

cc_proto_library(
    name = "cc_systems_proto",
    deps = [":systems_proto"],
)

proto_library(
    name = "updates_proto",
    srcs = ["updates.proto"],
    deps = [
        ":chat_proto",
        ":spatial_proto",
    ],
)

cc_proto_library(
    name = "cc_updates_proto",
    deps = [":updates_proto"],
)
