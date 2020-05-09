load("@npm_bazel_typescript//:index.bzl", "ts_devserver", "ts_library")
load("@npm_bazel_rollup//:index.bzl", "rollup_bundle")
load("@bazel_tools//tools/build_defs/pkg:pkg.bzl", "pkg_tar")


package(default_visibility = ["//visibility:public"])

exports_files(
    ["tsconfig.json"],
    visibility = ["//:__subpackages__"],
)

filegroup(
    name = "node_modules",
    srcs = glob(
        include = [
            "node_modules/**/*.js",
            "node_modules/**/*.d.ts",
            "node_modules/**/*.json",
            "node_modules/.bin/*",
        ],
        exclude = [
            # Files under test & docs may contain file names that
            # are not legal Bazel labels (e.g.,
            # node_modules/ecstatic/test/public/中文/檔案.html)
            "node_modules/**/test/**",
            "node_modules/**/docs/**",
            # Files with spaces in the name are not legal Bazel labels
            "node_modules/**/* */**",
            "node_modules/**/* *",
        ],
    ),
)

ts_library(
    name = "app",
    srcs = glob(["*.ts", "src/**/*.ts"]),
    deps = [
        "@npm//uuid",
        "//mass/api:ts_actions_proto",
        "//mass/api:ts_chat_proto",
        "//mass/api:ts_mass_proto",
        "//mass/api:ts_scenario_proto",
        "//mass/api:ts_spatial_proto",
        "//mass/api:ts_systems_proto",
        "//mass/api:ts_updates_proto",
    ],
)

rollup_bundle(
    name = "bundle",
    deps = [":app"],
    entry_point = "main.js",
    config_file = "rollup.config.js",
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

pkg_tar(
    name = "tar",
    strip_prefix = "/horrificlient",
    package_dir="/usr/share/nginx/html",
    srcs = [":index.html", ":bundle"],
    visibility = ["//static:__subpackages__"]
)
