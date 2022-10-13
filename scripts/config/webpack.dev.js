const { merge } = require('webpack-merge');
const webpack = require('webpack');
const { SERVER_HOST, SERVER_PORT } = require('../conf');
const common = require('./webpack.common');
const proxySetting = require('../setProxy');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  stats: 'minimal',
  devServer: {
    host: SERVER_HOST, // 指定 host，不设置的话默认是 localhost
    port: SERVER_PORT, // 指定端口，默认是8080
    client: {
      logging: 'warn',
      progress: true,
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    compress: true, // 是否启用 gzip 压缩
    // open: true, // 打开默认浏览器
    hot: true, // 热更新
    proxy: { ...proxySetting },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  optimization: {
    minimize: false,
    minimizer: [],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
    },
  },
});
