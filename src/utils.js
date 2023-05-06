const { deepClone } = require('@morev/utils');
const { WARNING, ERROR } = require('./constants.js');

const makeSmooth = (_config) => {
	const config = deepClone(_config);
	Object.entries(config.rules).forEach(([name, value]) => {
		if (value[0] === ERROR) value[0] = WARNING;
	});
	return config;
};

const modifyTypeEnum = (_config, { add, remove }) => {
	const config = deepClone(_config);

	if (add && Array.isArray(add) && add.length) {
		config.rules['type-enum'][2] = [...config.rules['type-enum'][2], ...add];
	}

	if (remove && Array.isArray(remove) && remove.length) {
		config.rules['type-enum'][2] = config.rules['type-enum'][2].filter(e => !remove.includes(e));
	}

	return config;
};

module.exports = { makeSmooth, modifyTypeEnum };
