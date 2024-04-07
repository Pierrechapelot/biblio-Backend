module.exports = {
  testEnvironment: "node",

  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  coverageReporters: ["text", "lcov"],

  roots: ["<rootDir>/tests", "<rootDir>/src"],

  transform: {
    "^.+\\.js$": "babel-jest",
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};
