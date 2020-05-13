load("@io_bazel_rules_kotlin//kotlin:kotlin.bzl", "kt_jvm_binary", "kt_jvm_import", "kt_jvm_library")
load("@io_bazel_rules_docker//kotlin:image.bzl", "kt_jvm_image")
load("@io_bazel_rules_k8s//k8s:object.bzl", "k8s_object")
load("@io_bazel_rules_k8s//k8s:objects.bzl", "k8s_objects")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")
load("@io_bazel_rules_docker//docker/package_managers:download_pkgs.bzl", "download_pkgs")
load("@io_bazel_rules_docker//docker/package_managers:install_pkgs.bzl", "install_pkgs")
load("@rules_jvm_external//:defs.bzl", "artifact")

kt_jvm_binary(
    name = "substrate",
    srcs = glob(["*.kt"]),
    main_class = "substrate.MainKt",
    runtime_deps = [
        "@com_github_jetbrains_kotlin//:kotlin-stdlib-jdk8",
        "@grpc_java//netty",
    ],
    deps = [
        "//mass/api:java_mass_grpc",
        "//substrate/sonar",
        "//substrate/vessel",
        "@com_github_jetbrains_kotlin//:kotlin-stdlib-jdk8",
        "@grpc_java//api",
        "@grpc_java//protobuf",
        "@grpc_java//stub",
        "@maven//:com_squareup_okhttp3_okhttp",
        "@maven//:org_jetbrains_kotlinx_kotlinx_coroutines_core",
    ],
)

kt_jvm_image(
    name = "image",
    srcs = glob(["*.kt"]),
    base = "gdal_ubuntu2004",
    main_class = "substrate.MainKt",
    runtime_deps = [
        "@com_github_jetbrains_kotlin//:kotlin-stdlib-jdk8",
        "@grpc_java//netty",
    ],
    deps = [
        "//mass/api:java_mass_grpc",
        "//substrate/sonar",
        "//substrate/vessel",
        "@grpc_java//api",
        "@grpc_java//protobuf",
        "@grpc_java//stub",
        "@maven//:com_squareup_okhttp3_okhttp",
        #        "@maven//:org_jetbrains_kotlin_kotlin_stdlib",
        #        "@maven//:org_jetbrains_kotlin_kotlin_stdlib_common",
        artifact(
            "org.jetbrains.kotlinx:kotlinx-coroutines-core",
            repository_name = "maven",
        ),
    ],
)

download_pkgs(
    name = "gdal_ubuntu2004_packages",
    image_tar = "@ubuntu2004//image",
    packages = [
        "libgdal-java",
        "openjdk-11-jre",
    ],
)

install_pkgs(
    name = "gdal_ubuntu2004",
    image_tar = "@ubuntu2004//image",
    installables_tar = ":gdal_ubuntu2004_packages.tar",
    output_image_name = "gdal_ubuntu2004",
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
