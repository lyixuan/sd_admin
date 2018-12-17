// 全局函数文件

import constants from './constants';

window.Filter = ({ constName = '', id = '', name = '' }) => {
  /**
   * 获取静态常量(constants.js)中的数据
   *
   * 1、根据常量constName获取常量数据
   * 2、根据id获取name(常量需为Array)
   * 3、根据name获取id(常量需为Array)
   *
   * @param Object     eg:{constName='', id='', name=''}  说明：constName:必传 id:选传 name:选传; constName必须是constants.js文件中定义好的常量
   * @return undefined or other
   * */
  let result = constants[constName];
  if (result && Array.isArray(result) && (id || name)) {
    result = '';
    // 查询常量名称存在，且常量值为数组，且有id或name参数
    for (let i = 0; i < result.length; i += 1) {
      if (result[i].id === String(id)) {
        result = result[i].name;
        break;
      }
      if (result[i].name === String(name)) {
        result = result[i].id;
        break;
      }
    }
  }
  return result;
};
