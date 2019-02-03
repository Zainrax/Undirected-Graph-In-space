const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  entry: {
    app: path.join(__dirname, 'src', 'app', 'script.js'),
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'src', 'public', 'index.html'),
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    })],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
      }],
      include: [
        path.resolve(__dirname, 'src', 'public'),
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
      ],
    }, {
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      },
      'css-loader'],
      include: [
        path.resolve(__dirname, 'src', 'style'),
      ],
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [
        'file-loader',
        {
          loader: 'image-webpack-loader',
          options: {
            bypassOnDebug: true,
            disable: true,
          },
        },
      ],
    }],
  },

  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css', '.html', '.png'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
};
