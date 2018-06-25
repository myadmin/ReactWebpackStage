const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const NameAllModulesPlugin = require('name-all-modules-plugin')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const cdnConfig = require('../app.config').cdn

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
	entry: {
		app: path.resolve(__dirname, '../client/app.js')
	},
	output: {
		filename: '[name].[hash].js',
	},
	plugins: [
		new HTMLPlugin({
			template: path.join(__dirname, '../client/template.html')
		}),
	  	new HTMLPlugin({
			template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
			filename: 'server.ejs'
		})
	]
})

if (isDev) {
	config.devtool = '#cheap-module-eval-source-map'
	config.entry = {
		app: [
			'react-hot-loader/patch',
			path.resolve(__dirname, '../client/app.js')
		]
	}

	config.devServer = {
		host: '0.0.0.0',
		port: '8080',
		// contentBase: path.join(__dirname, '../dist'),
		hot: true,
		overlay: {
			errors: true
		},
		publicPath: '/public/',
		historyApiFallback: {
			index: '/public/index.html'
		},
		proxy: {
			'/api': 'http://localhost:3000'
		}
	}

	config.plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
	config.entry = {
		app: path.resolve(__dirname, '../client/app.js'),
		vendor: [
			'react',
			'react-dom',
			'react-router-dom',
			'mobx',
			'mobx-react',
			'axios',
			'query-string',
			'dateformat',
			'marked',
		]
	}

	config.output.filename = '[name].[chunkhash].js'
	config.output.publicPath = cdnConfig.host
	config.plugins.push(
		new UglifyJSPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			minChunks: Infinity
		}),
		new webpack.NamedModulesPlugin(),
		new NameAllModulesPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.NamedModulesPlugin((chunk) => {
			if (chunk.name) {
				return chunk.name
			}
			return chunk.mapModules(m => path.relative(m.context, m.request)).join('_')
		})
	)
}

module.exports = config
