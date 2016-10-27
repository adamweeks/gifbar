var webpack = require('webpack');
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var options = {
  devtool: 'source-map',
  debug: true,

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
    extensions: ['','.ts','.js','.jsx','.json', '.css', '.html'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [ /node_modules/ ]
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        exclude: [ /node_modules/ ]
      },
      {
         test: /\.css$/,
         loader: "style-loader!css-loader"
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