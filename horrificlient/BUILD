package(default_visibility=["//visibility:public"])
load("@npm_bazel_typescript//:index.bzl", "ts_library")
load("@npm_bazel_typescript//:index.bzl", "ts_devserver", "ts_library")
load("@npm_bazel_rollup//:index.bzl", "rollup_bundle")

exports_files(["tsconfig.json"], visibility = ["//:__subpackages__"])

ts_library(
    name = "app",
    srcs = glob(["*.ts"])
)

rollup_bundle(
  name = "bundle",
  entry_point = "main.js",
  deps = [":app"],
)

ts_devserver(
    name = "devserver",
    # We'll collect all the devmode JS sources from these TypeScript libraries
    deps = [":lib"],
    # This is the path we'll request from the browser, see index.html
    serving_path = "/bundle.js",
    # The devserver can serve our static files too
)
