load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")

k8s_objects(
    name = "prod",
    objects = [
        "//envoy:prod",
        "//substrate:prod",
        "//static:prod",
        "//bloop:prod",
    ],
)

k8s_objects(
    name = "dev",
    objects = [
        "//envoy:dev",
        "//substrate:dev",
        "//static:dev",
        "//bloop:dev",
    ],
)

k8s_objects(
    name = "jam",
    objects = [
        "//envoy:jam",
        "//substrate:jam",
        "//static:jam",
        "//bloop:jam",
    ],
)
