// 全局函数文件

import constants from './constants';

window.Filter = param => {
  /**
   * 获取静态常量(constants.js)中的数据
   *
   * @param String                    必传  说明: 以管道符分割，第一个参数表示要获取的常量名，第二个参数为附加条件;中括号表示可选
   * eg: "constName"                  1、根据常量constName获取常量数据
   * eg: "constName[|id:yourId]"      2、根据id获取name(constName为Array)
   * eg: "constName[|name:yourName]"  3、根据name获取id(constName为Array)
   * eg: "constName[|id->value,name->label]"  4、获取constName 数组对象，并修改key名称
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
  let result = JSON.parse(JSON.stringify(constants[constName])) || null;

  // 第二个参数结果, 以管道分割
  if (condition) {
    if (condition.indexOf(':') > -1) {
      // 获取string
      const type = condition.split(':')[0];
      const value = condition.split(':')[1];
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
