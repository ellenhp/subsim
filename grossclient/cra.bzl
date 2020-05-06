def _cra_impl(ctx):
    # Generate a zip of all html files
    package_json_path = [
      f.path for f in ctx.files.srcs if f.path.endswith("/package.json")][0]
    basedir = package_json_path[:-13]
    zipfile = ctx.actions.declare_file(ctx.label.name + ".zip")
    ctx.actions.run_shell(
        outputs = [zipfile],
        inputs = ctx.files.srcs,
        command = "cd {} && npm install --no-bin-links && npm build --no-bin-links && zip -r ./build {}".format(
          basedir,
          zipfile.path)
    )
    return [DefaultInfo(files = depset([zipfile]))]
    
cra_app = rule(
    implementation = _cra_impl,
    attrs = {
        "srcs": attr.label_list(
            allow_files = True,
            doc = "CRA garbage interop w/ bazel"
        ),
    },
)
