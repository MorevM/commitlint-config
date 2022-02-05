const clonedeep = require('lodash.clonedeep');
const { WARNING, ERROR } = require('./constants');

const makeSmooth = (_config) => {
	const config = clonedeep(_config);
	Object.entries(config.rules).forEach(([name, value]) => {
		if (value[0] === ERROR) value[0] = WARNING;
	});
	return config;
};

const modifyTypeEnum = (_config, { add, remove }) => {
	const config = clonedeep(_config);

	if (add && Array.isArray(add) && add.length) {
		config.rules['type-enum'][2] = [...config.rules['type-enum'][2], ...add];
	}

	if (remove && Array.isArray(remove) && remove.length) {
		config.rules['type-enum'][2] = config.rules['type-enum'][2].filter(e => !remove.includes(e));
	}

	return config;
};

module.exports = { makeSmooth, modifyTypeEnum };
