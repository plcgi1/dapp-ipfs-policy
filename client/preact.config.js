export default (config, env /*, helpers */) => {
  config.devServer.proxy = [
    {
      // proxy requests matching a pattern:
      path: '/api/**',

      // where to proxy to:
      target: 'http://127.0.0.1:3000',

      // optionally change Origin: and Host: headers to match target:
      changeOrigin: true,
      changeHost: true,

      // optionally mutate request before proxying:
      pathRewrite: function(path, request) {
        // you can modify the outbound proxy request here:
        delete req.headers.referer;

        // common: remove first path segment: (/api/**)
        return '/' + path.replace(/^\/[^\/]+\//, '');
      },

      // optionally mutate proxy response:
      onProxyRes: function(proxyRes, req, res) {
        // you can modify the response here:
        proxyRes.headers.connection = 'keep-alive';
        proxyRes.headers['cache-control'] = 'no-cache';
      }
    }
  ];
  if (env.isProd) {
    
    // Make async work
    let babel = config.module.loaders.filter( loader => loader.loader === 'babel-loader')[0].options;
    // Blacklist regenerator within env preset:
    babel.presets[0][1].exclude.push('transform-async-to-generator');
    // Add fast-async
    babel.plugins.push([require.resolve('fast-async'), { spec: true }]);
  }
};