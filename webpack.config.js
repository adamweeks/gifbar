var path = require('path');
var webpack = require('webpack');
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var options = {
  devtool: 'source-map',
  debug: true,

  entry: {
    'angular2': [
      'zone.js',
      'rxjs',
      'reflect-metadata',
      '@angular/core',
      '@angular/common',
      '@angular/http',
      '@angular/platform-browser-dynamic'
    ],
    'app': './src/react/index.jsx'
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
    new CommonsChunkPlugin({ name: 'angular2', filename: 'angular2.js', minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'common',   filename: 'common.js' })
  ],
  target:'node-webkit'
};

options.target = webpackTargetElectronRenderer(options);

module.exports = options;