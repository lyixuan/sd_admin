// 全局函数文件

import constants from './constants';

window.Filter = (constName, item) => {
  /**
   * 获取静态常量(constants.js)中的数据
   *
   * 1、根据常量Name获取常量数据(Array or other)
   * 2、根据id获取name(常量需为Array)
   * 3、根据name获取id(常量需为Array)
   *
   * @param String            constName      必传  说明：constName必须是constants.js文件中定义好的常量
   * @param String or Number  item(id或name) 选传  说明：1.传id，根据id返回name；2.传name，根据name返回id 3.不传，返回constName的值
   * @return undefined or other
   * */
  let result = constants[constName];
  if (result && Array.isArray(result) && item) {
    // 查询常量名称存在，且常量值为数组，且有第二个参数
    for (let i = 0; i < result.length; i += 1) {
      if (result[i].id === item) {
        result = result[i].name;
        break;
      }
      if (result[i].name === item) {
        result = result[i].id;
        break;
      }
    }
  }
  return result;
};
