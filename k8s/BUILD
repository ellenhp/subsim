load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")

k8s_object(
  name = "prod",
  kind = "deployment",

  # A template of a Kubernetes Deployment object yaml.
  template = ":deployment.yaml",

  # An optional collection of docker_build images to publish
  # when this target is bazel run.  The digest of the published
  # image is substituted as a part of the resolution process.
  images = {
    "gcr.io/mass-276203/mass:dev": "//mass:image"
  },
)
