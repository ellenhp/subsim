genrule(
    name = "bellhop",
    srcs = glob([
        "*.f90",
    ]) + ["Makefile"],
    outs = ["bellhop.exe"],
    cmd = "cd acoustics/bellhop ; make ; cp ./bellhop.exe ../../$(RULEDIR)",
)
