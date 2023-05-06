// This file is needed for `@commitlint/cli` package that only works with CJS.

const config = require('./dist/index.cjs');

module.exports = config;
