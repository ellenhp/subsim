import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "./main.js",
  output: {
    format: "iife",
    file: "output/bundle.js",
  },
  //external: ["crypto"],
  plugins: [resolve()],
};
