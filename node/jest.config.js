module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files using ts-jest
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  testMatch: ["**/tests/**/*.test.ts"], // Match test files in the 'tests' folder
};
