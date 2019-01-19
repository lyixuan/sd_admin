/* eslint-disable no-extend-native */
// 全局函数文件

import constants from './constants';

window.BI_Filter = param => {
  /**
   * 获取静态常量(constants.js)中的数据
   *
   * @param String                                          必传  说明: 以管道符分割，第一个参数表示要获取的常量名，第二个参数为附加条件
   * eg: BI_Filter('FRONT_ROLE_TYPE_LIST')                  1、根据常量constName获取常量数据
   * eg: BI_Filter('FRONT_ROLE_TYPE_LIST|id:class')         2、根据id='class'筛选本行object数据(constName需为Array)
   * eg: BI_Filter('FRONT_ROLE_TYPE_LIST|id:class').level           3、根据id='class'筛选本行object数据中level的值(constName需为Array)
   * eg: BI_Filter('FRONT_ROLE_TYPE_LIST|id->value,name->label')    4、获取constName 数组对象，并修改key名称，将id改为value，将name改为label (constName需为Array)
   *
   * @return undefined or other
   * */
  if (!param) {
    console.warn('请传入字符串参数');
    return false;
  }

  if (typeof param !== 'string') {
    console.warn('参数类型应为string');
    return false;
  }

  const tempArr = param.split('|');
  const constName = tempArr[0];
  const condition = tempArr[1];

  // 第一个参数结果, 以管道分割
  let result = constants[constName] ? JSON.parse(JSON.stringify(constants[constName])) : [];

  // 第二个参数结果, 以管道分割
  if (condition) {
    if (condition.indexOf(':') > -1) {
      // 获取string
      const type = condition.split(':')[0];
      const value = condition.split(':')[1];
      if (value === '') {
        result = {};
      } else if (result && Array.isArray(result) && type) {
        // 存在第二个参数，查询常量名称存在，且常量值为数组，且有id或name参数

        const list = [...result];
        result = {};
        for (let i = 0; i < list.length; i += 1) {
          if (list[i][type] === value) {
            result = list[i];
            break;
          }
        }
      } else {
        console.warn('请求数据格不是数组，或key不存在');
        return null;
      }
    } else if (condition.indexOf('->') > -1 && result && Array.isArray(result)) {
      // 获取数组并修改key

      const conditionArr = condition.split(',');
      result.forEach((v1, i) => {
        conditionArr.forEach(v2 => {
          const oldKey = v2.split('->')[0];
          const newKey = v2.split('->')[1];
          result[i][newKey] = v1[oldKey];
          delete result[i][oldKey];
        });
      });
    } else {
      console.warn('参数格式错误');
      return false;
    }
  }
  return result;
};
