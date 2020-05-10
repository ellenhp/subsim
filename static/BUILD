load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")
load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")
load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")

package(default_visibility = ["//k8s:__subpackages__"])

k8s_objects(
  name = "prod",
  objects = [
    ":prod-deployment",
    ":prod-service",
  ]
)

k8s_object(
  name = "prod-deployment",
  kind = "deployment",
  cluster = "gke_mass-276203_us-central1-c_milky",
  # A template of a Kubernetes Deployment object yaml.
  template = ":deployment.yaml",

  # An optional collection of docker_build images to publish
  # when this target is bazel run.  The digest of the published
  # image is substituted as a part of the resolution process.
  images = {
    "gcr.io/mass-276203/static:dev": "//static:image",
  },
)

k8s_object(
  name = "prod-service",
  kind = "service",
  cluster = "gke_mass-276203_us-central1-c_milky",
  template = ":service.yaml",
)

container_push(
   name = "publish",
   image = ":image",
   format = "Docker",
   registry = "gcr.io",
   repository = "mass-276203/static",
   tag = "dev",
)

container_image(
  name = "image",
  base = "@nginx//image",
  tars = ["//cowfarts:tar"],
)
