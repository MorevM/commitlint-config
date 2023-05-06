// eslint-disable-next-line import/no-extraneous-dependencies, node/no-extraneous-import -- Defined as a dependency of `@commitlint/cli`
import _rules from '@commitlint/rules';

// eslint-disable-next-line no-unused-vars
import { OFF, WARNING, ERROR } from './constants.js';

// Only needed to make it work with the default `rollup` auto-interop,
// which is hard-coded in the `unbuild` package :\
const rules = _rules.default || _rules;

export default {
	// For exclamation mark as `breaking change` support
	parserPreset: 'conventional-changelog-conventionalcommits',
	// https://commitlint.js.org/#/reference-rules
	rules: {
		/**
		 * No need to configure `header` separately from `scope`/`type`/`subject`
		 */
		'header-case': [OFF, 'always', 'sentence-case'],
		'header-full-stop': [ERROR, 'never', '.'],
		'header-max-length': [OFF, 'always', 100],
		'header-min-length': [OFF, 'always', 3],

		/**
		 * Type should be defined, one from list.
		 */
		'type-enum': [ERROR, 'always', [
			'feat',
			'fix',
			'refactor',
			'perf',
			'test',
			'docs',
			'chore',
			'release',
			'revert',
			'build',
			'ci',
			'wip',
			'nvm',
		]],
		'type-case': [ERROR, 'always', 'lower-case'],
		'type-empty': [ERROR, 'never'],
		'type-max-length': [OFF, 'always', Infinity],
		'type-min-length': [OFF, 'always', 0],

		/**
		 * Scope can be omitted, but if defined, it should be in lowercase.
		 */
		'scope-enum': [OFF, 'always', []], // should be configured per-project
		'scope-case': [ERROR, 'always', 'lower-case'],
		'scope-empty': [OFF, 'never'],
		'scope-max-length': [OFF, 'always', Infinity],
		'scope-min-length': [OFF, 'always', 0],

		/**
		 * Subject should be in sentence case, have length between 3 and 100
		 * and shouldn't ends with dot. Also allows `!` mark before `:`.
		 */
		'subject-case': [ERROR, 'always', 'sentence-case'],
		'subject-empty': [ERROR, 'never'],
		'subject-max-length': [ERROR, 'always', 100],
		'subject-min-length': [ERROR, 'always', 3],
		'subject-exclamation-mark': [OFF, 'never'],

		/**
		 * Body can be omitted, but if defined, it starts with leading blank line,
		 * should be written in sentence case and should ends with dot.
		 */
		'body-full-stop': [OFF, 'always', '.'],
		'body-leading-blank': [ERROR, 'always'],
		'body-empty': [OFF, 'never'],
		'body-max-length': [OFF, 'always', Infinity],
		'body-max-line-length': [OFF, 'always', Infinity],
		'body-min-length': [OFF, 'always', OFF],
		// `body-case` is redefined via the local plugin below
		// to allow a single link as a body.
		'body-case': [ERROR, 'always', 'sentence-case'],

		/**
		 * Footer can be omitted, but if defined, it starts with leading blank line,
		 * should be written in sentence case and should ends with dot.
		 */
		'footer-leading-blank': [ERROR, 'always'],
		'footer-empty': [OFF, 'never'],
		'footer-max-length': [OFF, 'always', Infinity],
		'footer-max-line-length': [OFF, 'always', Infinity],
		'footer-min-length': [OFF, 'always', 0],

		/**
		 * Other rules
		 */
		'references-empty': [OFF, 'never'],
		'signed-off-by': [OFF, 'always', 'Signed-off-by:'],
		'trailer-exists': [OFF, 'always', 'Signed-off-by:'],
	},
	plugins: [
		{
			rules: {
				'body-case': (parsed, when, value) => {
					const originalResult = rules['body-case'](parsed, when, value);
					// There is no need to do something extra if the original rule is passed.
					if (originalResult[0] === true) return originalResult;
					// Detect a single link and modify the output if needed.
					const onlyLink = /https?:\/\/\S+$/.test((parsed.body || '').trim());
					return onlyLink ? [true] : [false, `${originalResult[1]} or contain a single link`];
				},
			},
		},
	],
};
