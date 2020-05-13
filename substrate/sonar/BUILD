load("@io_bazel_rules_kotlin//kotlin:kotlin.bzl", "kt_jvm_library")

kt_jvm_library(
    name = "sonar",
    srcs = glob(["*.kt"]),
    visibility = ["//substrate:__subpackages__"],
    deps = [
        "//bloop/api:java_bloop_grpc",
        "//bloop/api:java_bloop_proto",
        "//mass/api:java_spatial_proto",
        "@maven//:org_gdal_gdal",
    ],
)
