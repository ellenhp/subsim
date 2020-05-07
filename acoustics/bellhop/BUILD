load("//acoustics:fortran_rules.bzl", "f90_binary", "f90_library")

package(default_visibility = ["//visibility:public"])

f90_binary(
    name = "bellhop",
    out = "bellhop.exe",
    deps = [
        "ArrMod.o",
        "AttenMod.o",
        "MathConstants.o",
        "PolyMod.o",
        "ReadEnvironmentBell.o",
        "RefCoef.o",
        "ReflectMod.o",
        "SortMod.o",
        "SourceReceiverPositions.o",
        "WriteHeader.o",
        "WriteRay.o",
        "angleMod.o",
        "bdryMod.o",
        "beampattern.o",
        "bellhop.o",
        "bellhopMod.o",
        "errout.o",
        "influence.o",
        "miscSspMod.o",
        "monotonicMod.o",
        "munk.o",
        "pchipMod.o",
        "splinec.o",
        "sspMod.o",
        "subtabulate.o",
    ],
)

f90_library(
    name = "bellhop_lib",
    srcs = [
        "bellhop.f90",
    ],
    deps = [
        "ArrMod.o",
        "AttenMod.o",
        "MathConstants.o",
        "ReadEnvironmentBell.o",
        "RefCoef.o",
        "ReflectMod.o",
        "SourceReceiverPositions.o",
        "WriteRay.o",
        "angleMod.o",
        "anglemod.mod",
        "arrmod.mod",
        "attenmod.mod",
        "bdryMod.o",
        "bdrymod.mod",
        "beampattern.mod",
        "beampattern.o",
        "bellhopMod.o",
        "bellhopmod.mod",
        "influence.mod",
        "influence.o",
        "mathconstants.mod",
        "readenvironmentbell.mod",
        "refcoef.mod",
        "reflectmod.mod",
        "sourcereceiverpositions.mod",
        "sspMod.o",
        "sspmod.mod",
        "writeray.mod",
    ],
)

f90_library(
    name = "angle_mod",
    srcs = ["angleMod.f90"],
    mods = [
        "anglemod.mod",
    ],
    deps = [
        "mathconstants.mod",
        "sortmod.mod",
        "sourcereceiverpositions.mod",
        "subtabulate.mod",
    ],
)

f90_library(
    name = "arrmod",
    srcs = [
        "ArrMod.f90",
    ],
    mods = [
        "arrmod.mod",
    ],
    deps = ["mathconstants.mod"],
)

f90_library(
    name = "bdrymod",
    srcs = [
        "bdryMod.f90",
    ],
    mods = [
        "bdrymod.mod",
    ],
    deps = ["monotonicmod.mod"],
)

f90_library(
    name = "influence",
    srcs = [
        "influence.f90",
    ],
    mods = [
        "influence.mod",
    ],
    deps = [
        "arrmod.mod",
        "bellhopmod.mod",
        "sourcereceiverpositions.mod",
        "sspmod.mod",
        "writeray.mod",
    ],
)

f90_library(
    name = "bellhopmod",
    srcs = [
        "bellhopMod.f90",
    ],
    mods = [
        "bellhopmod.mod",
    ],
    deps = [
        "mathconstants.mod",
    ],
)

f90_library(
    name = "writeray",
    srcs = [
        "WriteRay.f90",
    ],
    mods = [
        "writeray.mod",
    ],
    deps = [
        "bellhopmod.mod",
        "sspmod.mod",
    ],
)

f90_library(
    name = "reflectmod",
    srcs = [
        "ReflectMod.f90",
    ],
    mods = [
        "reflectmod.mod",
    ],
    deps = [
        "bellhopmod.mod",
        "cone.mod",
        "refcoef.mod",
        "sspmod.mod",
    ],
)

f90_library(
    name = "cone",
    srcs = [
        "Cone.f90",
    ],
    mods = ["cone.mod"],
    deps = [
        "bellhopmod.mod",
        "mathconstants.mod",
    ],
)

f90_library(
    name = "readenvironmentbell",
    srcs = [
        "ReadEnvironmentBell.f90",
    ],
    mods = ["readenvironmentbell.mod"],
    deps = [
        "anglemod.mod",
        "attenmod.mod",
        "bdrymod.mod",
        "bellhopmod.mod",
        "mathconstants.mod",
        "sourcereceiverpositions.mod",
        "sspmod.mod",
    ],
)

f90_library(
    name = "misc",
    srcs = [
        "MergeVectors.f90",
        "PekerisRoot.f90",
        "PolyMod.f90",
        "ReadEnvironmentMod.f90",
        "ReadHeader.f90",
        "RefCoef.f90",
        "WriteHeader.f90",
        "beampattern.f90",
        "calculateweights.f90",
        "cross_products.f90",
        "errout.f90",
        "interpolation.f90",
        # "monotonicMod.f90",
        "munk.f90",
        "norms.f90",
        "splinec.f90",
        "twersky.f90",
        "xerror.f90",
    ],
    mods = [
        "refcoef.mod",
        "beampattern.mod",
        "readenvironmentmod.mod",
    ],
    deps = [
        "attenmod.mod",
        "mathconstants.mod",
        "miscsspmod.mod",
        "monotonicmod.mod",
        "pchipmod.mod",
        "sourcereceiverpositions.mod",
        "subtabulate.mod",
    ],
)

f90_library(
    name = "source_receiver_positions",
    srcs = [
        "SourceReceiverPositions.f90",
    ],
    mods = [
        "sourcereceiverpositions.mod",
    ],
    deps = [
        "monotonicmod.mod",
        "sortmod.mod",
        "subtabulate.mod",
    ],
)

f90_library(
    name = "monotonic_mod",
    srcs = [
        "monotonicMod.f90",
    ],
    mods = [
        "monotonicmod.mod",
    ],
)

f90_library(
    name = "subtabulate",
    srcs = [
        "subtabulate.f90",
    ],
    mods = [
        "subtabulate.mod",
    ],
)

f90_library(
    name = "sort_mod",
    srcs = [
        "SortMod.f90",
    ],
    mods = [
        "sortmod.mod",
    ],
)

f90_library(
    name = "math_constants",
    srcs = [
        "MathConstants.f90",
    ],
    mods = [
        "mathconstants.mod",
    ],
)

f90_library(
    name = "sspmod",
    srcs = [
        "sspMod.f90",
    ],
    mods = ["sspmod.mod"],
    deps = [
        "attenmod.mod",
        "pchipmod.mod",
    ],
)

f90_library(
    name = "miscsspmod",
    srcs = [
        "miscSspMod.f90",
    ],
    mods = ["miscsspmod.mod"],
    deps = [
        "attenmod.mod",
        "pchipmod.mod",
    ],
)

f90_library(
    name = "pchipmod",
    srcs = [
        "pchipMod.f90",
    ],
    mods = ["pchipmod.mod"],
)

f90_library(
    name = "attenmod",
    srcs = [
        "AttenMod.f90",
    ],
    mods = ["attenmod.mod"],
    deps = [
        "mathconstants.mod",
    ],
)
