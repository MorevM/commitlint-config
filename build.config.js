export default {
	rollup: {
		emitCJS: true,
	},
	entries: [
		'./src/index',
		'./src/utils',
	],
	externals: [/@commitlint/],
	hooks: {},
	failOnWarn: false,
};
