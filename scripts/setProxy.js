const proxySettings = {
  // 接口代理1
  '/api/': {
    target: 'http://127.0.0.1:3001',
    changeOrigin: true,
  },
  // 接口代理2
  '/api-2/': {
    target: 'http://127.0.0.1:3002',
    changeOrigin: true,
    pathRewrite: {
      '^/api-2': '',
    },
  },
};

module.exports = proxySettings;
