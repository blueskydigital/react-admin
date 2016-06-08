var path = require('path');

module.exports = {
  entry: './js/main.js',
  output: {
    // path: __dirname + '/build',
    filename: '[name].js'
  },
  externals: {
    "moment": "moment"
  },
  module: {
    loaders: [{
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
    }]
  },
  plugins: [
  ],
  node: {
    fs: 'empty'
  }
};
