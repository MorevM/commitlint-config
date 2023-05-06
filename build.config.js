export default {
	rollup: {
		emitCJS: true,
	},
	entries: [
		'./src/index',
		'./src/smooth',
		'./src/utils',
	],
	externals: [/@commitlint/],
	hooks: {},
	failOnWarn: false,
};
