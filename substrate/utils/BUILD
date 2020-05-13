load("@io_bazel_rules_kotlin//kotlin:kotlin.bzl", "kt_jvm_library")

kt_jvm_library(
    name = "utils",
    srcs = glob(["*.kt"]),
    visibility = ["//substrate:__subpackages__"],
    deps = [
        "//mass/api:java_spatial_proto",
    ],
)
