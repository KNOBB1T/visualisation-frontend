/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  collectCoverageFrom: [
    "src/Components/**/*.{js,jsx,ts,tsx}", // replace with the file formats you use
    "!**/node_modules/**",
    "!**/jest.config.js",
    "!**/coverage/**"
  ],
};
