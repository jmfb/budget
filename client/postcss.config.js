const autoprefixer = require('autoprefixer');

const nodeEnvIndex = process.argv.indexOf('--node-env');
const nodeEnvValue = process.argv[nodeEnvIndex + 1];
const isProduction = nodeEnvValue === 'production';
const isDebug = !isProduction;

module.exports = {
	sourceMap: isDebug,
	plugins: [autoprefixer()]
};
