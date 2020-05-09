load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")

k8s_objects(
    name = "prod",
    objects = [
        "//envoy:prod",
        "//mass:prod",
        "//bloop:prod",
    ],
)
