module.exports = {
  verbose: true,
  testTimeout: 40000,
  testEnvironment: "jsdom",
  roots: ["app/javascript/src", "donut/src"],
  setupFilesAfterEnv: ["<rootDir>/app/javascript/src/testHelpers/setup.js"],
  moduleDirectories: [
    "node_modules",
    "app/javascript",
    "app/javascript/src",
    "app/javascript/src/testHelpers",
  ],
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!lodash-es)"],
  moduleNameMapper: {
    "@advisable/donut": "<rootDir>/donut/src",
    "@guild/(.*)": "<rootDir>/app/javascript/guild/$1",
    "@advisable-main/(.*)": "<rootDir>/app/javascript/src/$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$":
      "<rootDir>/app/javascript/src/__mocks__/fileMock.js",
    "\\.(css|scss)$": "<rootDir>/app/javascript/src/__mocks__/styleMock.js",
  },
  transform: {
    "\\.(gql|graphql)$": "jest-transform-graphql",
    ".*": "babel-jest",
  },
  snapshotSerializers: ["jest-styled-components"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
