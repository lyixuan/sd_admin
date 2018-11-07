/* 这是百分比上传和展示的方法
 * type：2是家族，3是小组
 * flag：*是乘法，/是除法
 * data：需要格式化的数据源
 */

export function showPercentFn(data, type, flag) {
  Object.keys(data).map(item => {
    const res = data[item];
    res.forEach((value, i) => {
      if (flag === '/') {
        res[i].levelLowerLimit = value.levelLowerLimit / 100;
        res[i].levelUpperLimit = value.levelUpperLimit / 100;
        if (type === 3) {
          res[i].classKpi = value.classKpi / 100;
          res[i].groupKpi = value.groupKpi / 100;
        }
      } else {
        res[i].levelLowerLimit = value.levelLowerLimit * 100;
        res[i].levelUpperLimit = value.levelUpperLimit * 100;
        if (type === 3) {
          res[i].classKpi = value.classKpi * 100;
          res[i].groupKpi = value.groupKpi * 100;
        }
      }
    });
    return res;
  });
}
