load("@io_bazel_rules_docker//container:container.bzl", "container_image", "container_push")
load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")
load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")

package(default_visibility = ["//k8s:__subpackages__"])

k8s_objects(
    name = "prod",
    objects = [
        ":prod-deployment",
        ":prod-service",
    ],
)

k8s_objects(
    name = "dev",
    objects = [
        ":dev-deployment",
        ":dev-service",
    ],
)

k8s_object(
    name = "prod-deployment",
    cluster = "gke_mass-276203_us-central1-c_milky",
    images = {
        "gcr.io/mass-276203/envoy:dev": "//envoy:image",
    },
    kind = "deployment",
    template = ":deployment.yaml",
)

k8s_object(
    name = "prod-service",
    cluster = "gke_mass-276203_us-central1-c_milky",
    kind = "service",
    template = ":service.yaml",
)

k8s_object(
    name = "dev-deployment",
    cluster = "mass-dev",
    images = {
        "gcr.io/mass-276203/envoy:dev": "//envoy:image",
    },
    kind = "deployment",
    template = ":deployment.yaml",
)

k8s_object(
    name = "dev-service",
    cluster = "mass-dev",
    kind = "service",
    template = ":service-dev.yaml",
)

container_push(
    name = "publish",
    format = "Docker",
    image = ":image",
    registry = "gcr.io",
    repository = "mass-276203/envoy",
    tag = "dev",
)

container_image(
    name = "image",
    base = "@envoy_base//image",
    directory = "/etc/envoy",
    files = [":envoy.yaml"],
)
