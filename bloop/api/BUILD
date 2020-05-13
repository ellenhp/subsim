load("@rules_proto//proto:defs.bzl", "proto_library")
load("@com_github_grpc_grpc//bazel:python_rules.bzl", "py_grpc_library", "py_proto_library")
load("@grpc_java//:java_grpc_library.bzl", "java_grpc_library")
load("@rules_java//java:defs.bzl", "java_proto_library")

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

java_proto_library(
    name = "java_bloop_proto",
    deps = [":bloop_proto"],
)

java_grpc_library(
    name = "java_bloop_grpc",
    srcs = [":bloop_proto"],
    deps = [
        ":java_bloop_proto",
    ],
)
