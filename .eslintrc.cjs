import stylisticJs from '@stylistic/eslint-plugin-js'
import typescriptEslint from '@typescript-eslint/eslint-plugin';


/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'@stylistic/js/keyword-spacing': 'warn',
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: {
		'@typescript-eslint': typescriptEslint,
		'@stylistic/js': stylisticJs
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
