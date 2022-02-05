/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-autofix/sonarjs/no-identical-functions */
const loadConfig = require('@commitlint/load').default;
const lintMessage = require('@commitlint/lint').default;
const index = require('../src');
const { makeSmooth, modifyTypeEnum } = require('../src/utils');

const getConfig = async (smooth = false) => {
	return loadConfig(smooth ? makeSmooth(index) : index);
};

const modifiedLintFactory = (options) => async (message) => {
	const config = await getConfig();
	const { rules, parserPreset } = modifyTypeEnum(config, options);
	return lintMessage(message, rules, parserPreset ? { parserOpts: parserPreset.parserOpts } : {});
};

const lintFactory = (smooth = false) => async (message, config = null) => {
	const { rules, parserPreset } = await getConfig(smooth);
	return lintMessage(message, rules, parserPreset ? { parserOpts: parserPreset.parserOpts } : {});
};


describe('Realization', () => {
	describe('Default config', () => {
		const lint = lintFactory(false);

		it('Passes with correct message', async () => {
			const result = await lint('feat: Add crutch');

			expect(result.valid).toBe(true);
		});

		it('Fails with incorrect message', async () => {
			const result = await lint('fix: remove crutch');

			expect(result.valid).toBe(false);
		});
	});

	describe('Smooth config', () => {
		const lint = lintFactory(true);

		it('Passes with no warnings with correct message', async () => {
			const result = await lint('feat: Add crutch');

			expect(result.valid).toBe(true);
		});

		it('Passes with incorrect message', async () => {
			const result = await lint('fix: remove crutch');

			expect(result.valid).toBe(true);
		});

		it('Respect warnings in smooth mode', async () => {
			const result = await lint('fix: remove crutch');

			expect(result.warnings).toHaveLength(1);
		});
	});

	describe('Modified config', () => {
		const lint = modifiedLintFactory({
			add: ['custom'],
			remove: ['fix'],
		});

		it('Passes with added custom type', async () => {
			const result = await lint('custom: Add crutch');

			expect(result.valid).toBe(true);
		});

		it('Fails with removed custom type', async () => {
			const result = await lint('fix: Fix crutch');

			expect(result.valid).toBe(false);
		});
	});
});
