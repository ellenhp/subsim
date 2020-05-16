load("@io_bazel_rules_docker//container:container.bzl", "container_image")
load("@io_bazel_rules_docker//docker/package_managers:download_pkgs.bzl", "download_pkgs")
load("@io_bazel_rules_docker//docker/package_managers:install_pkgs.bzl", "install_pkgs")
load("@io_bazel_rules_docker//docker/util:run.bzl", "container_run_and_extract")

download_pkgs(
    name = "gfortran_ubuntu2004_packages",
    image_tar = "@ubuntu2004//image",
    packages = [
        "gfortran",
        "make",
    ],
)

install_pkgs(
    name = "gfortran_ubuntu2004",
    image_tar = "@ubuntu2004//image",
    installables_tar = ":gfortran_ubuntu2004_packages.tar",
    output_image_name = "gfortran_ubuntu2004",
)

container_image(
    name = "gfortran_ubuntu2004_to_build_bellhop",
    base = ":gfortran_ubuntu2004.tar",
    files = glob(["**"]),
)

container_run_and_extract(
    name = "bellhop",
    commands = [
        "cd /",
        "make",
    ],
    extract_file = "/bellhop.exe",
    image = ":gfortran_ubuntu2004_to_build_bellhop.tar",
)

#bazel-bin/acoustics/bellhop/gfortran_ubuntu2004_to_build_bellhop-layer.tar
