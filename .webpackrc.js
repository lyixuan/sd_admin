const path = require('path');

const uploadImageHostObj = {
  production: 'http://bi-admin.ministudy.com/staticFile/classFile', // http://bi-admin.ministudy.com/staticFile/classFile
  development: 'http://172.16.117.65',
};

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
    'process.env.ENV_TYPE': process.env.ENV_TYPE,
    USE_COMMA: 222,
    UPLOAD_HOST: uploadImageHostObj[process.env.ENV_TYPE],
  },
};
