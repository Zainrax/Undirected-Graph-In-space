const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    index: 'index.html',
    open: 'chrome',
    contentBase: './dist',
    port: 9000,
  },
});
