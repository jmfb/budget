const autoprefixer = require('autoprefixer');

const isProduction = process.argv[process.argv.indexOf('--node-env') + 1] === 'production';
const isDebug = !isProduction;

module.exports = {
	sourceMap: isDebug,
	plugins: [
		autoprefixer()
	]
};
