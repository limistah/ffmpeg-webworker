const path = require("path");
const { createConfig, babel, css } = require("webpack-blocks");

module.exports = {
  title: "ffmpeg-webworker",
  styleguideDir: path.join(__dirname, "docs"),
  webpackConfig: createConfig([babel(), css()]),
  exampleMode: "expand",
  usageMode: "expand",
  showSidebar: false,
  serverPort: 8080,
  moduleAliases: {
    "ffmpeg-webworker": path.resolve(__dirname, "./src")
  },
  require: [path.join(__dirname, "examples/theme.css")],
  sections: [
    {
      name: "",
      content: "README.MD"
    }
  ]
};
