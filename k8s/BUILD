load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")
load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")

k8s_object(
  name = "ingress-prod",
  kind = "service",
  cluster = "gke_mass-276203_us-central1-c_milky",
  # A template of a Kubernetes Deployment object yaml.
  template = ":service.yaml",
)

k8s_objects(
  name = "prod",
  objects = [
    "//envoy:prod",
    "//mass:prod",
    #":ingress-prod"
  ]
)
