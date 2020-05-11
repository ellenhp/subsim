load("@io_bazel_rules_kotlin//kotlin:kotlin.bzl", "kt_jvm_binary")

kt_jvm_binary(
    name = "substrate",
    srcs = glob(["*.kt"]),
    main_class = "substrate.MainKt",
    runtime_deps = ["@grpc_java//netty"],
    deps = [
        "//mass/api:java_mass_grpc",
        "//substrate/vessel",
        "@com_github_jetbrains_kotlin//:kotlin-stdlib-jdk8",
        "@grpc_java//api",
        "@grpc_java//protobuf",
        "@grpc_java//stub",
    ],
)
