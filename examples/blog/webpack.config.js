var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    main: "./js/main.js",
    style: "./styles/main.scss"
  },
  output: {
    // path: __dirname + '/build',
    filename: '[name].js'
  },
  externals: {
    "moment": "moment"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel?presets[]=es2015&presets[]=react',
        exclude: [
          /node_modules\/immutable/,
          /node_modules\/moment/,
          /node_modules\/esprima-fb/,
          /node_modules\/jsx-transform/,
          /node_modules\/codemirror/,
          /node_modules\/medium-editor/,
        ]
        // include: [
        //   path.resolve(__dirname, "js")
        // ]
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
      { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"},
      { test: /\.woff2$/, loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]"},
      { test: /\.(eot|ttf|svg|gif|png)$/, loader: "file-loader" }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css', { allChunks: true }),
  ],
  node: {
    fs: 'empty'
  }
};
