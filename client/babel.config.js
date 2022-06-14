const isTest = process.env.NODE_TEST === 'test';

module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: isTest ? 'commonjs' : 'auto',
				targets: 'last 2 versions, >0.5% in US, not dead, ie 11',
				useBuiltIns: false,
				loose: false
			}
		],
		'@babel/preset-react',
		'@babel/preset-typescript'
	],
	plugins: [
		[
			'@babel/plugin-proposal-class-properties',
			{
				loose: false
			}
		],
		'@babel/plugin-proposal-object-rest-spread',
		'babel-plugin-macros',
		'@babel/plugin-transform-runtime'
	]
};
