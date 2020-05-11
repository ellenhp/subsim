load("@io_bazel_rules_kotlin//kotlin:kotlin.bzl", "kt_jvm_binary", "kt_jvm_library")
load("@io_bazel_rules_docker//java:image.bzl", "java_image")
load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")
load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")

kt_jvm_library(
    name = "substrate_lib",
    srcs = glob(["*.kt"]),
    deps = [
        "//mass/api:java_mass_grpc",
        "//substrate/vessel",
        "@com_github_jetbrains_kotlin//:kotlin-stdlib-jdk8",
        "@grpc_java//api",
        "@grpc_java//protobuf",
        "@grpc_java//stub",
    ],
)

kt_jvm_binary(
    name = "substrate",
    main_class = "substrate.MainKt",
    runtime_deps = ["@grpc_java//netty"],
    deps = [":substrate_lib"],
)

java_image(
    name = "image",
    srcs = ["Main.java"],
    main_class = "substrate.Main",
    runtime_deps = ["@grpc_java//netty"],
    deps = [":substrate_lib"],
)

k8s_objects(
    name = "prod",
    objects = [
        ":prod-deployment",
        ":prod-service",
    ],
)

k8s_object(
    name = "prod-deployment",
    cluster = "gke_mass-276203_us-central1-c_milky",
    images = {
        "gcr.io/mass-276203/mass:dev": "//substrate:image",
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

container_push(
    name = "publish",
    format = "Docker",
    image = ":image",
    registry = "gcr.io",
    repository = "mass-276203/substrate",
    tag = "dev",
)
