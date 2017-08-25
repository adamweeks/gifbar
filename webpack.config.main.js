  const webpack = require('webpack');

  var options = {
    devtool: 'source-map',
    target: 'electron-main',
    entry: './src/main.js',

    output: {
      path: __dirname + '/build/',
      publicPath: '',
      filename: 'main.js',
      sourceMapFilename: 'main.js.map',
      chunkFilename: '[id].chunk.js'
    },

    resolve: {
      extensions: ['.ts','.js','.jsx','.json', '.css', '.html']
    },
    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
      __dirname: false,
      __filename: false
    },

    plugins: [
      new webpack.NamedModulesPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif|icns|html)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]'
              }
            }
          ]
        }
      ]
    }

  };

  module.exports = options;
