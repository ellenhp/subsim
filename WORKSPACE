workspace(
    name = "mass",
    managed_directories = {"@npm": ["horrificlient/node_modules"]},
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

# Download the rules_docker repository at release v0.14.1
http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "dc97fccceacd4c6be14e800b2a00693d5e8d07f69ee187babfd04a80a9f8e250",
    strip_prefix = "rules_docker-0.14.1",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.14.1/rules_docker-v0.14.1.tar.gz"],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//python3:image.bzl", _py3_image_repositories = "repositories")

_py3_image_repositories()

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

http_archive(
    name = "build_bazel_rules_nodejs",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/1.6.1/rules_nodejs-1.6.1.tar.gz"],
    sha256 = "d14076339deb08e5460c221fae5c5e9605d2ef4848eee1f0c81c9ffdc1ab31c1"
)

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories")

load("@build_bazel_rules_nodejs//:index.bzl", "npm_install")
npm_install(
    # Name this npm so that Bazel Label references look like @npm//package
    name = "npm",
    package_json = "//horrificlient:package.json",
    package_lock_json = "//horrificlient:package-lock.json",
)

# Install any Bazel rules which were extracted earlier by the npm_install rule.
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")
install_bazel_dependencies()

# Set up TypeScript toolchain
load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")
ts_setup_workspace()

http_archive(
    name = "io_bazel_grpc_web",
    strip_prefix = "grpc-web-c7dedab92c0f3e77ec6f30d5268ee1cdb12ab11b",
    urls = [
        "https://github.com/grpc/grpc-web/archive/c7dedab92c0f3e77ec6f30d5268ee1cdb12ab11b.tar.gz",
    ],
)

http_archive(
    name = "io_bazel_rules_closure",
    sha256 = "7d206c2383811f378a5ef03f4aacbcf5f47fd8650f6abbc3fa89f3a27dd8b176",
    strip_prefix = "rules_closure-0.10.0",
    urls = [
        "https://github.com/bazelbuild/rules_closure/archive/0.10.0.tar.gz",
    ],
)

load("@io_bazel_rules_closure//closure:repositories.bzl", "rules_closure_dependencies", "rules_closure_toolchains")

rules_closure_dependencies()

rules_closure_toolchains()
