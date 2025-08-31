const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://www.openligadb.de',
      changeOrigin: true,
      secure: true,
      // logLevel: 'debug',
    })
  );
};
