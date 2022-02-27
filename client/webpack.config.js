const AssetsPlugin = require('assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const EsLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const webpack = require('webpack');

const isProduction = process.argv[process.argv.indexOf('--node-env') + 1] === 'production';
const isDebug = !isProduction;
const isVerbose = process.env.VERBOSE === 'true';
const isTest = process.env.NODE_TEST === 'test';
const isAnalyze = process.env.ANALYZE === 'true';
const treatWarningsAsErrors = !process.argv.includes('--watch');

const buildDir = path.resolve(__dirname, '../server/wwwroot/dist');

module.exports = {
	mode: isDebug ? 'development' : 'production',
	entry: {
		'bundle': [
			'whatwg-fetch',
			'./src/index.tsx'
		]
	},
	output: {
		publicPath: '/dist/',
		path: buildDir,
		filename: '[name].js?[chunkhash]',
		chunkFilename: '[name].[id].js?[chunkhash]',
		pathinfo: isDebug
	},
	resolve: {
		alias: {
			'~': path.join(__dirname, 'src')
		},
		extensions: ['*', '.tsx', '.ts', '.jsx', '.js']
	},
	module: {
		rules: [
			{
				test: /\.(j|t)sx?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDebug,
							url: false,
							modules: {
								localIdentName: isDebug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]'
							}
						}
					},
					'postcss-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: isTest ? '[name].css' : '[name].css?[contenthash]'
		}),
		new EsLintPlugin({
			extensions: ['ts', 'tsx'],
			failOnWarning: treatWarningsAsErrors,
			exclude: [
				'node_modules'
			]
		}),
		new ForkTsCheckerWebpackPlugin(),
		...isTest ? [] : [
			new CleanWebpackPlugin(),
			new AssetsPlugin({
				path: buildDir
			})
		],
		...isAnalyze ? [new BundleAnalyzerPlugin()] : []
	],
	cache: isDebug,
	stats: {
		colors: true,
		reasons: isDebug,
		hash: isVerbose,
		version: isVerbose,
		timings: true,
		chunks: isVerbose,
		chunkModules: isVerbose,
		cached: isVerbose,
		cachedAssets: isVerbose,
		children: isVerbose
	},
	optimization: {
		minimize: isProduction,
		minimizer: [
			new TerserWebpackPlugin(),
			new CssMinimizerWebpackPlugin()
		],
		splitChunks: {
			chunks: 'all'
		}
	}
};
