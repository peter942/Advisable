const path = require("path");

module.exports = {
  addons: ["@storybook/addon-knobs", "@storybook/addon-docs"],
  stories: [
    "../src/**/*.stories.@(js|mdx)",
    "../../app/javascript/**/*.stories.@(js|mdx)",
  ],
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias["@advisable/donut"] = path.resolve(
      __dirname,
      "../src",
    );

    // Return the altered config
    return config;
  },
};
