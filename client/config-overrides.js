// const { injectBabelPlugin } = require('react-app-rewired');
// const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  // config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  // config = rewireLess.withLoaderOptions({
  //   javascriptEnabled: true,
  //   modifyVars: {
  //     // '@primary-color': '#67a0e4',
  //     // '@secondary-color': '#595555',
  //     // '@text-color': '#ada3ea',
  //     // '@text-color-secondary': '#0C0D14',
  //     // '@heading-color': '#0C0D14',
  //     // '@layout-header-background': '#2D314C',
  //     // '@btn-primary-bg': '#67a0e4'
  //   },
  // })(config, env);
  
  return config;
};