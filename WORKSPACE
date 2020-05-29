workspace(
    name = "mass",
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "com_github_grpc_grpc",
    sha256 = "a4539cd7cb811c5d01e33ee447ce8a87b4d62e8860dce4f8fc1dfdeabfd80194",
    strip_prefix = "grpc-cb81fe0dfaa424eb50de26fb7c904a27a78c3f76",
    urls = [
        "https://github.com/grpc/grpc/archive/cb81fe0dfaa424eb50de26fb7c904a27a78c3f76.tar.gz",
    ],
)

load("@com_github_grpc_grpc//bazel:grpc_deps.bzl", "grpc_deps")

grpc_deps()

load("@com_github_grpc_grpc//bazel:grpc_extra_deps.bzl", "grpc_extra_deps")

grpc_extra_deps()

http_archive(
    name = "grpc_java",
    strip_prefix = "grpc-java-1.29.0",
    urls = [
        "https://github.com/grpc/grpc-java/archive/v1.29.0.zip",
    ],
)

load("@grpc_java//:repositories.bzl", "grpc_java_repositories")

grpc_java_repositories()

http_archive(
    name = "rules_python_external",
    sha256 = "5a1d7e6e4bab49dcdd787694f0f5d52ac5debdfc1852981a89cc414e338d60dc",
    strip_prefix = "rules_python_external-3aacabb928a710b10bff13d0bde49ceaade58f15",
    url = "https://github.com/dillon-giacoppo/rules_python_external/archive/3aacabb928a710b10bff13d0bde49ceaade58f15.zip",
)

# Install the rule dependencies
load("@rules_python_external//:repositories.bzl", "rules_python_external_dependencies")

rules_python_external_dependencies()

load("@rules_python_external//:defs.bzl", "pip_install")

pip_install(
    name = "bloop_deps",
    requirements = "//bloop:requirements.txt",
)

http_archive(
    name = "io_bazel_rules_docker",
    strip_prefix = "rules_docker-972f3ebf800f45ed44853c735b1840fffdd6128b",
    urls = ["https://github.com/bazelbuild/rules_docker/archive/972f3ebf800f45ed44853c735b1840fffdd6128b.tar.gz"],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//python3:image.bzl", _py3_image_repositories = "repositories")

_py3_image_repositories()

load(
    "@io_bazel_rules_docker//java:image.bzl",
    _java_image_repos = "repositories",
)

_java_image_repos()

# This is NOT needed when going through the language lang_image
# "repositories" function(s).
load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load(
    "@io_bazel_rules_docker//container:container.bzl",
    "container_pull",
)
load("@io_bazel_rules_docker//container:pull.bzl", "container_pull")

container_pull(
    name = "alpine_linux_amd64",
    registry = "index.docker.io",
    repository = "library/alpine",
    tag = "3.8",
)

container_pull(
    name = "ubuntu2004",
    registry = "index.docker.io",
    repository = "library/ubuntu",
    tag = "focal",
)

container_pull(
    name = "java_base",
    # 'tag' is also supported, but digest is encouraged for reproducibility.
    digest = "sha256:deadbeef",
    registry = "gcr.io",
    repository = "distroless/java",
)

container_repositories()

load(
    "@io_bazel_rules_docker//cc:image.bzl",
    _cc_image_repos = "repositories",
)

_cc_image_repos()

# This requires rules_docker to be fully instantiated before
# it is pulled in.
# Download the rules_k8s repository at release v0.4
http_archive(
    name = "io_bazel_rules_k8s",
    sha256 = "d91aeb17bbc619e649f8d32b65d9a8327e5404f451be196990e13f5b7e2d17bb",
    strip_prefix = "rules_k8s-0.4",
    urls = ["https://github.com/bazelbuild/rules_k8s/releases/download/v0.4/rules_k8s-v0.4.tar.gz"],
)

load("@io_bazel_rules_k8s//k8s:k8s.bzl", "k8s_repositories")

k8s_repositories()

load("@io_bazel_rules_k8s//k8s:k8s_go_deps.bzl", k8s_go_deps = "deps")

k8s_go_deps()

container_pull(
    name = "envoy_base",
    registry = "index.docker.io",
    repository = "envoyproxy/envoy-dev",
    tag = "latest",
)

container_pull(
    name = "nginx",
    registry = "index.docker.io",
    repository = "library/nginx",
    tag = "latest",
)

# Kotlin stuff <3

rules_kotlin_version = "legacy-1.3.0"

rules_kotlin_sha = "4fd769fb0db5d3c6240df8a9500515775101964eebdf85a3f9f0511130885fde"

http_archive(
    name = "io_bazel_rules_kotlin",
    sha256 = rules_kotlin_sha,
    strip_prefix = "rules_kotlin-%s" % rules_kotlin_version,
    type = "zip",
    urls = ["https://github.com/bazelbuild/rules_kotlin/archive/%s.zip" % rules_kotlin_version],
)

load("@io_bazel_rules_kotlin//kotlin:kotlin.bzl", "kotlin_repositories", "kt_register_toolchains")

kotlin_repositories()

kt_register_toolchains()

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_file")

RULES_JVM_EXTERNAL_TAG = "3.2"

RULES_JVM_EXTERNAL_SHA = ""

http_archive(
    name = "rules_jvm_external",
    sha256 = RULES_JVM_EXTERNAL_SHA,
    strip_prefix = "rules_jvm_external-%s" % RULES_JVM_EXTERNAL_TAG,
    url = "https://github.com/bazelbuild/rules_jvm_external/archive/%s.zip" % RULES_JVM_EXTERNAL_TAG,
)

load("@rules_jvm_external//:defs.bzl", "maven_install")

maven_install(
    artifacts = [
        "org.gdal:gdal:jar:3.0.0",
        "com.squareup.okhttp3:okhttp:4.6.0",
        "org.jetbrains.kotlinx:kotlinx-coroutines-core:jar:1.3.6",
    ],
    repositories = [
        "https://jcenter.bintray.com/",
        "https://maven.google.com",
        "https://repo1.maven.org/maven2",
    ],
)

all_content = """filegroup(name = "all", srcs = glob(["**/*"]), visibility = ["//visibility:public"])"""

http_archive(
    name = "gdal",
    build_file_content = all_content,
    strip_prefix = "gdal-3.1.0/gdal",
    urls = ["https://github.com/OSGeo/gdal/archive/v3.1.0.tar.gz"],
)

http_archive(
    name = "rules_foreign_cc",
    strip_prefix = "rules_foreign_cc-74b146dc87d37baa1919da1e8f7b8aafbd32acd9",
    url = "https://github.com/bazelbuild/rules_foreign_cc/archive/74b146dc87d37baa1919da1e8f7b8aafbd32acd9.zip",
)

load("@rules_foreign_cc//:workspace_definitions.bzl", "rules_foreign_cc_dependencies")

rules_foreign_cc_dependencies()
