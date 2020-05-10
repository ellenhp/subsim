load("@bazel_tools//tools/build_defs/pkg:pkg.bzl", "pkg_tar")

filegroup(
    name = "distfiles",
    srcs = glob(["dist/**"]),
)

pkg_tar(
    name = "tar",
    strip_prefix = "/cowfarts/dist",
    package_dir="/usr/share/nginx/html",
    srcs = [":buildfiles"],
    visibility = ["//static:__subpackages__"]
)
