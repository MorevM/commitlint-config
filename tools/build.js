const { resolve } = require('path');
const fs = require('fs');
const util = require('util');
const { ESLint } = require('eslint');
const config = require('../src');
const { makeSmooth } = require('../src/utils');

const eslint = new ESLint({ fix: true });

const pkg = require('../package.json');

const BUILD_DIR_REL = './build';
const BUILD_DIR = resolve(__dirname, '..', BUILD_DIR_REL);

fs.rmSync(BUILD_DIR, { recursive: true, force: true });
fs.mkdirSync(BUILD_DIR, { recursive: true });

const toNames = (name) => ({
	exportsName: `./${name}`,
	fileName: `${BUILD_DIR_REL}/${name}.js`,
});

const toExports = (source) =>
	`module.exports = ${util.inspect(source, { maxArrayLength: 9999, depth: 999 })}`;

const configurations = [{
	name: 'index',
	smooth: false,
}, {
	name: 'smooth',
	smooth: true,
}];

(async () => {
	let exportsField = {};
	configurations.forEach(({ name, smooth }) => {
		let configSource = smooth ? makeSmooth(config) : config;
		configSource = toExports(configSource);

		const { exportsName, fileName } = toNames(name);
		fs.writeFileSync(`${BUILD_DIR}/${name}.js`, configSource);
		exportsField[exportsName] = fileName;
	});

	exportsField = {
		// Main export aliasing `/index`
		'.': exportsField[`./index`],
		'./utils': './src/utils.js',
		...exportsField,
	};

	pkg.exports = exportsField;
	pkg.main = exportsField['.'];

	fs.writeFileSync(`package.json`, JSON.stringify(pkg, null, '\t'));
	ESLint.outputFixes(await eslint.lintFiles('./package.json')); // lint updated
})();
