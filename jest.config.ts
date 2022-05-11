export default {
  preset: "ts-jest",
  collectCoverage: true,
  coverageDirectory: "<rootDir>/tests/coverage",
  collectCoverageFrom: ["src/*.ts"],
};
