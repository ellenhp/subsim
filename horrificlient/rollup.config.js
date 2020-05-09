import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  preferBuiltins: false,
  input: "./main.js",
  context: "window",
  output: {
    format: "iife",
    file: "bundle.js",
  },
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: "node_modules",
      },
    }),
    commonjs(), // converts date-fns to ES modules
  ],
};
