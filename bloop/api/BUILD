load("@rules_proto//proto:defs.bzl", "proto_library")
load("@com_github_grpc_grpc//bazel:python_rules.bzl", "py_grpc_library", "py_proto_library")

package(default_visibility = ["//visibility:public"])

proto_library(
    name = "bloop_proto",
    srcs = ["bloop.proto"],
)

py_proto_library(
    name = "py_bloop_proto",
    deps = [":bloop_proto"],
)

py_grpc_library(
    name = "py_bloop_grpc",
    srcs = [":bloop_proto"],
    deps = [":py_bloop_proto"],
)
