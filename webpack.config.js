export default {
  entry: "./src/main.js",
  mode: "production",
  watch: true,
  experiments: {
    outputModule: true,
  },
  output: {
    library: {
      type: "module",
    },
    filename: "lib.flux.min.mjs",
  },
}
