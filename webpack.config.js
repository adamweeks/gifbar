var webpack = require('webpack');
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var options = {
  devtool: 'source-map',
  entry: {
    'app': './src/app/index.jsx'
  },

  output: {
    path: __dirname + '/build/',
    publicPath: 'build/',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['.ts','.js','.jsx','.json', '.css', '.html']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  },

  plugins: [
    new CommonsChunkPlugin({ name: 'common',   filename: 'common.js' })
  ],
  target:'node-webkit'
};

options.target = webpackTargetElectronRenderer(options);

module.exports = options;