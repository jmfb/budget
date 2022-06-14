const TEST = process.env.NODE_TEST === 'test';

module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint', '@typescript-eslint/tslint'],
	extends: ['prettier'],
	rules: {
		semi: 'off',
		camelcase: 'off',
		'no-multi-spaces': 'error',
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'parameter',
				format: ['camelCase'],
				leadingUnderscore: TEST ? 'allow' : 'forbid',
				trailingUnderscore: TEST ? 'allow' : 'forbid'
			},
			{
				selector: 'variableLike',
				format: ['camelCase']
			},
			{
				selector: 'function',
				format: ['camelCase', 'PascalCase']
			},
			{
				selector: ['typeLike', 'enumMember'],
				format: ['PascalCase']
			}
		],
		'@typescript-eslint/no-empty-function': TEST ? 'off' : 'error',
		'@typescript-eslint/no-unused-expressions': 'error',
		'@typescript-eslint/quotes': ['error', 'single'],
		'@typescript-eslint/semi': ['error', 'always'],
		'@typescript-eslint/type-annotation-spacing': 'error',
		'brace-style': 'off',
		'@typescript-eslint/brace-style': [
			'error',
			'1tbs',
			{
				allowSingleLine: true
			}
		],
		'comma-dangle': 'error',
		'eol-last': 'error',
		eqeqeq: ['error', 'smart'],
		'guard-for-in': 'error',
		'id-blacklist': [
			'error',
			'any',
			'Number',
			'number',
			'String',
			'string',
			'Boolean',
			'boolean',
			'Undefined',
			'undefined'
		],
		'id-match': 'error',
		'max-len': [
			'error',
			{
				code: 140
			}
		],
		'no-bitwise': 'error',
		'no-console': [
			'error',
			{
				allow: [
					'log',
					'dirxml',
					'warn',
					'error',
					'dir',
					'timeLog',
					'assert',
					'clear',
					'count',
					'countReset',
					'group',
					'groupCollapsed',
					'groupEnd',
					'table',
					'Console',
					'markTimeline',
					'profile',
					'profileEnd',
					'timeline',
					'timelineEnd',
					'timeStamp',
					'context'
				]
			}
		],
		'no-debugger': 'error',
		'no-empty': 'error',
		'no-eval': 'error',
		'no-new-wrappers': 'error',
		'no-redeclare': 'error',
		'no-restricted-properties': [
			2,
			{
				object: '$',
				property: 'extend',
				message: 'Please use { ...o, } instead.'
			},
			{
				object: '_',
				property: 'isNull',
				message: 'Please use === null instead.'
			},
			{
				object: '_',
				property: 'isUndefined',
				message: 'Please use === undefined instead.'
			}
		],
		'no-trailing-spaces': 'error',
		'no-underscore-dangle': 'error',
		'no-unused-labels': 'error',
		radix: 'error',
		'spaced-comment': [
			'error',
			'always',
			{
				markers: ['/']
			}
		]
	}
};
