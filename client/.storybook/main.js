const postcss = require('postcss');
const path = require('path');

module.exports = {
	stories: ['../src/**/*.stories.tsx'],
	framework: {
		name: '@storybook/react-webpack5',
		options: {}
	},
	docs: {
		autodocs: 'tag'
	},
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		{
			name: '@storybook/addon-postcss',
			options: {
				cssLoaderOptions: {
					modules: {
						localIdentName: '[name]_[local]_[hash:base64:3]'
					}
				},
				postcssLoaderOptions: {
					implementation: postcss
				}
			}
		}
	],
	webpackFinal: config => {
		config.resolve = {
			alias: {
				'~': path.join(__dirname, '../src')
			},
			extensions: ['*', '.tsx', '.ts', '.jsx', '.js']
		};
		return config;
	}
};
