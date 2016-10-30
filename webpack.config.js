var debug = process.env.NODE_ENV !== "production"
var webpack = require('webpack')
var path = require('path')
var libraryName = 'react-mobx-admin'

module.exports = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  output: {
    libraryTarget: 'umd',
    library: libraryName,
    path: __dirname + '/lib',
    filename: libraryName + '.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  externals: {
    'mobx-react': {
      root: 'mobxReact',
      commonjs: 'mobx-react',
      commonjs2: 'mobx-react',
      amd: 'mobx-react'
    },
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    mobx: 'mobx',
    axios: 'axios',
    'material-ui': 'material-ui'
  }
}
