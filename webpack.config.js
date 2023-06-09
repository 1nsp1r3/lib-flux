module.exports = {
  entry: "./src/main.js",
  mode: "production",
  watch: true,
  output: {
    library: {
      type: "commonjs2", //For Espruino ("commonjs" doesn't work when exporting a class)
    },
    filename: "lib.flux.min.js",
  },
}
