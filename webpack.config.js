var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var options = {
  devtool: 'source-map',
  entry: {
    'app': './src/app/index.jsx'
  },

  output: {
    path: __dirname + '/build/',
    publicPath: '',
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
          {
            loader: "css-loader",
            options: {
              camelCase: true,
              modules: true,
              localIdentName: `[local]--[hash:base64:5]`,
              importLoaders: 1,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        loader: 'url-loader',
        options: {
          name: 'images/[name].[ext]',
          limit: 10000,
          // outputPath: 'images'
        },
      }
    ]
  },

  plugins: [
    new CommonsChunkPlugin({ name: 'common',   filename: 'common.js' })
  ],
  target: 'electron-renderer'
};

module.exports = options;
