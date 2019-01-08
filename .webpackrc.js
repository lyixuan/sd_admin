const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    '@': path.resolve(__dirname, 'src'),
    components: path.resolve(__dirname, 'src/components/'),
    selfComponents: path.resolve(__dirname, 'src/selfComponent/'),
    utils: path.resolve(__dirname, 'src/utils/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: false,
  publicPath: '/',
  hash: true,
  define: {
    'process.env.API_TYPE': process.env.API_TYPE,
    USE_COMMA: 2,
  },
};