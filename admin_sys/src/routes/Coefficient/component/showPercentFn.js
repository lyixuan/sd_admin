/* 这是百分比上传和展示的方法
 * type：2是家族，3是小组
 * flag：*是乘法，/是除法
 * data：需要格式化的数据源
 */
// export function showPercentFn(data, type, flag) {
//   Object.keys(data).map(item => {
//     const res = data[item];
//     res.forEach((value, i) => {
//       if (Number(value.type) !== 3) {
//         // 排除管理系数
//         if (flag === '/') {
//           res[i].levelLowerLimit = value.levelLowerLimit / 100;
//           res[i].levelUpperLimit = value.levelUpperLimit / 100;
//           if (type === 3) {
//             res[i].classKpi = value.classKpi / 100;
//             res[i].groupKpi = value.groupKpi / 100;
//           }
//         } else {
//           res[i].levelLowerLimit = parseFloat((value.levelLowerLimit * 100).toPrecision(12));
//           res[i].levelUpperLimit = parseFloat((value.levelUpperLimit * 100).toPrecision(12));
//           if (type === 3) {
//             res[i].classKpi = parseFloat((value.classKpi * 100).toPrecision(12));
//             res[i].groupKpi = parseFloat((value.groupKpi * 100).toPrecision(12));
//           }
//         }
//       }
//     });
//     return res;
//   });
// }
const requireWords1 = ['levelLowerLimit', 'levelUpperLimit', 'levelValue'];
const requireWords2 = ['classKpi', 'groupKpi', 'teacherCount'];
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
          requireWords1.forEach(val => {
            if (value[val] === null || value[val] === '') {
              if (cal) cal();
              return false;
            }
          });
          res[i].levelLowerLimit =
            flag === '/'
              ? value.levelLowerLimit / 100
              : parseFloat((value.levelLowerLimit * 100).toPrecision(12));
          res[i].levelUpperLimit =
            flag === '/'
              ? value.levelUpperLimit / 100
              : parseFloat((value.levelUpperLimit * 100).toPrecision(12));
          break;
        case 3: // 排除管理系数
          requireWords1.forEach(val => {
            if (value[val] === null && value[val] === '') {
              if (cal) cal();
              return false;
            }
          });
          break;
        case 8:
          requireWords2.forEach(val => {
            if (value[val] === null || value[val] === '') {
              if (cal) cal();
              return false;
            }
          });
          res[i].classKpi =
            flag === '/'
              ? value.classKpi / 100
              : parseFloat((value.classKpi * 100).toPrecision(12));
          res[i].groupKpi =
            flag === '/'
              ? value.groupKpi / 100
              : parseFloat((value.groupKpi * 100).toPrecision(12));
          break;
        default:
          break;
      }
    });
    return res;
  });
}
