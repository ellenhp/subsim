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

""" Fortran rules to compile bellhop. """

def f90_library(name, srcs = [], deps = [], mods = []):
    rename_commands = ["cp $(location :" + f + ") $(RULEDIR)/" + f.rstrip("f90") + "cpp ;" for f in srcs]

    compile_one_template = "gfortran -c -static-libgfortran -funroll-all-loops -fomit-frame-pointer -static -ffast-math"
    compile_commands = [compile_one_template + " $(location :" + f + ")" for f in srcs]

    copy_deps = ["find bazel-out/ -mindepth 2 -type l -exec mv -i '{}' . ';'"]
    copy_outs = ["cp " + f.rstrip("f90") + "o " + "$(RULEDIR)" for f in srcs]
    copy_mods = ["cp " + mod + " $(RULEDIR)" for mod in mods]

    outs = [f.rstrip("f90") + "o" for f in srcs] + mods
    native.genrule(
        name = name,
        srcs = srcs + deps,
        outs = outs,
        cmd = "; ".join(copy_deps + compile_commands + copy_outs + copy_mods),
    )

def f90_binary(name, out, srcs = [], deps = []):
    rename_commands = ["cp $(location :" + f + ") $(RULEDIR)/" + f.rstrip("f90") + "cpp ;" for f in srcs]

    fflags = " "
    compile = "gfortran -static-libgfortran -o " + out + fflags + " ".join(["$(location " + f + ")" for f in deps])
    copy_out = "cp " + out + " " + "$(RULEDIR)"

    # copy_deps = ["find bazel-out/ -mindepth 2 -type l -exec mv -i '{}' . ';'"]

    native.genrule(
        name = name,
        srcs = srcs + deps,
        outs = [out],
        cmd = "; ".join([compile, copy_out]),
    )
