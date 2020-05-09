load("@npm_bazel_typescript//:index.bzl", "ts_devserver", "ts_library")
load("@npm_bazel_rollup//:index.bzl", "rollup_bundle")
load("@bazel_tools//tools/build_defs/pkg:pkg.bzl", "pkg_tar")


package(default_visibility = ["//visibility:public"])

exports_files(
    ["tsconfig.json"],
    visibility = ["//:__subpackages__"],
)

ts_library(
    name = "app",
    srcs = glob(["*.ts", "src/**/*.ts"]),
    deps = [
        "@npm//uuid",
        "@npm//@types/uuid",
        "@npm//google-protobuf",
        "@npm//grpc-web",
        "//mass/api:ts_actions_proto",
        "//mass/api:ts_chat_proto",
        "//mass/api:ts_mass_proto",
        "//mass/api:ts_scenario_proto",
        "//mass/api:ts_spatial_proto",
        "//mass/api:ts_systems_proto",
        "//mass/api:ts_updates_proto",
    ],
)

ts_devserver(
    name = "devserver",
    entry_module = "mass/horrificlient/main",
    serving_path = "/bundle.js",
    static_files = ["index.html"],
    deps = [
        ":app",
        "@npm//google-protobuf:google-protobuf__umd",
        "@npm//grpc-web:grpc-web__umd",
        "@npm//uuid:uuid__umd",
    ],
)

rollup_bundle(	
    name = "bundle",	
    deps = [	
        ":app",	
        "@npm//@rollup/plugin-node-resolve",
        "@npm//@rollup/plugin-commonjs",
        "@npm//google-protobuf:google-protobuf__umd",
        "@npm//grpc-web:grpc-web__umd",
        "@npm//uuid:uuid__umd",
    ],
    config_file = ":rollup.config.js",
    entry_point = "main.ts",
)

pkg_tar(
    name = "tar",
    strip_prefix = "/horrificlient",
    package_dir="/usr/share/nginx/html",
    srcs = [":index.html", ":bundle"],
    visibility = ["//static:__subpackages__"]
)
