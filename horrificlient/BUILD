package(default_visibility=["//visibility:public"])
load("@npm_bazel_typescript//:index.bzl", "ts_library")
load("@npm_bazel_typescript//:index.bzl", "ts_devserver", "ts_library")
load("@npm_bazel_rollup//:index.bzl", "rollup_bundle")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")

exports_files(["tsconfig.json"], visibility = ["//:__subpackages__"])

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
    deps = ["//mass/api:ts_mass_proto"],
    srcs = glob(["*.ts"])
)

rollup_bundle(
  name = "bundle",
  entry_point = "main.js",
  deps = [":app"],
)

ts_devserver(
    name = "devserver",
    deps = [":app"],
    serving_path = "/bundle.js",
    static_files = ["index.html"],
)
