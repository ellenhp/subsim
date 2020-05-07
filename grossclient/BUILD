load("@bazel_tools//tools/build_defs/pkg:pkg.bzl", "pkg_tar")

filegroup(
    name = "buildfiles",
    srcs = glob(["build/**"]),
)

pkg_tar(
    name = "tar",
    strip_prefix = "/grossclient/build",
    package_dir="/usr/share/nginx/html",
    srcs = [":buildfiles"],
    visibility = ["//static:__subpackages__"]
)
