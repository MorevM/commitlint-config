export default {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	collectCoverageFrom: ['./src/*.js'],
	transform: {},
	verbose: true,
	testEnvironment: 'node',
	testPathIgnorePatterns: [
		'__tests__/tests-utils.js',
	],
};
