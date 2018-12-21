const path = require('path');

module.exports = {
  plugins: [
    [
      'module-resolver',
      'transform-decorators-legacy', // 添加es7修饰器
      {
        alias: {
          components: path.join(__dirname, './src/components'),
        },
      },
    ],
    [
      'import',
      {
        libraryName: 'antd',
        style: true, // or 'css'
      },
    ],
  ],
};
