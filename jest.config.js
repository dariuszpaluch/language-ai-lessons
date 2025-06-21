/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// The directory where Jest should output its coverage files
	coverageDirectory: "coverage",

	// An array of regexp pattern strings used to skip coverage collection
	coveragePathIgnorePatterns: [
		"/node_modules/"
	],

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: "babel", // or 'v8'

	// A list of reporter names that Jest uses when writing coverage reports
	coverageReporters: [
		"json",
		"text",
		"lcov",
		"clover"
	],

	// An object that configures minimum threshold enforcement for coverage results
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: -10,
		},
	},

	// A map from regular expressions to paths to transformers
	// We need this to use `import` in our test files
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
	},

	// The test environment that will be used for testing
	testEnvironment: "node",

	// The glob patterns Jest uses to detect test files
	testMatch: [
		"**/__tests__/**/*.[jt]s?(x)",
		"**/?(*.)+(spec|test).[tj]s?(x)"
	],
};
