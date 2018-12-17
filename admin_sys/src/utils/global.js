// 全局函数文件

import constants from './constants';

window.Filter = param => {
  /**
   * 获取静态常量(constants.js)中的数据
   *
   * @param String                    必传
   * eg: "constName"                  1、根据常量constName获取常量数据
   * eg: "constName[|id:yourId]"      2、根据id获取name(constName为Array)
   * eg: "constName[|name:yourName]"  3、根据name获取id(constName为Array)
   *
   * 说明: 中括号表示可选参数；constName必须是constants.js文件中定义好的常量
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

  // 第一个参数结果
  let result = constants[constName] || null;

  // 第二个参数结果
  if (tempArr[1]) {
    const type = tempArr[1].split(':')[0];
    const value = tempArr[1].split(':')[1];
    if (result && Array.isArray(result) && type && value) {
      // 存在第二个参数，查询常量名称存在，且常量值为数组，且有id或name参数

      const list = [...result];
      result = null;
      for (let i = 0; i < list.length; i += 1) {
        if (type === 'id' && list[i].id === value) {
          result = list[i].name;
          break;
        }
        if (type === 'name' && list[i].name === value) {
          result = list[i].id;
          break;
        }
      }
    } else {
      console.warn('参数格式错误');
      return false;
    }
  }
  return result;
};
