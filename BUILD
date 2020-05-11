# Copyright (C) 2020 Ellen Poe
#
# This file is part of MASS.
#
# MASS is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# MASS is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with MASS.  If not, see <http://www.gnu.org/licenses/>.

alias(
    name = "tsconfig.json",
    actual = "//horrificlient:tsconfig.json",
    visibility = ["//visibility:public"],
)

load("@io_bazel_rules_kotlin//kotlin:kotlin.bzl", "define_kt_toolchain")

KOTLIN_LANGUAGE_LEVEL = "1.3"

JAVA_LANGUAGE_LEVEL = "1.8"

KOTLIN_LANGUAGE_LEVEL = "1.3"

define_kt_toolchain(
    name = "kotlin_toolchain",
    api_version = KOTLIN_LANGUAGE_LEVEL,
    jvm_target = JAVA_LANGUAGE_LEVEL,
    language_version = KOTLIN_LANGUAGE_LEVEL,
)
