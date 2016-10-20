var debug = process.env.NODE_ENV !== "production"
var webpack = require('webpack')
var path = require('path')

module.exports = {
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/main.js",
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      }
    ]
  },
  output: {
    path: path.join(__dirname, "examples/list_test"),
    filename: "main.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
  resolve: {
    alias: {
      'react-mobx-admin': path.join(__dirname, '../..'),
    },
  }
}
