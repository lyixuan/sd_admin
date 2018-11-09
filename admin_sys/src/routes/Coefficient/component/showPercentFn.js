/* 这是百分比上传和展示的方法
 * flag：*是乘法，/是除法
 * data：需要格式化的数据源
 */
const requireWords1 = ['levelLowerLimit', 'levelUpperLimit', 'levelValue'];
const requireWords2 = ['classKpi', 'groupKpi', 'teacherCount'];

function fieldCheck(filed, value, cal) {
  // 字段判空校验
  filed.forEach(val => {
    if (value[val] === null || value[val] === '') {
      if (cal) cal();
      return false;
    }
  });
}
function fieldFormat(flag, value) {
  // 上传回显格式
  return flag === '/' ? value / 100 : parseFloat((value * 100).toPrecision(12));
}

export function showPercentFn(data, flag, cal) {
  Object.keys(data).map(item => {
    const res = data[item];
    res.forEach((value, i) => {
      switch (Number(value.type)) {
        case 1:
        case 2:
        case 4:
        case 5:
        case 6:
        case 7:
          fieldCheck(requireWords1, value, cal);
          res[i].levelLowerLimit = fieldFormat(flag, value.levelLowerLimit);
          res[i].levelUpperLimit = fieldFormat(flag, value.levelUpperLimit);
          break;
        case 3: // 排除管理系数
          fieldCheck(requireWords1, value, cal);
          break;
        case 8:
          fieldCheck(requireWords2, value, cal);
          res[i].classKpi = fieldFormat(flag, value.classKpi);
          res[i].groupKpi = fieldFormat(flag, value.groupKpi);

          break;
        default:
          break;
      }
    });
    return res;
  });
}
