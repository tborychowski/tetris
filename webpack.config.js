const path = require('path');

module.exports = {
	devtool: 'inline-source-map',
	mode: 'development',
	entry: {
		index: './src/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.js', '.json']
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: { loader: 'html-loader' }
			},
			{
				test: /\.less$/,
				use: [
					{ loader: 'style-loader'  },  // adds style to html
					{ loader: 'css-loader' },     // translates CSS into CommonJS
					{ loader: 'less-loader'  },   // compiles Less to CSS
				]
			},
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			}
		]
	}
};
