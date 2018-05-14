export function dealWithRelativeData(arr_now, arr_last, groupId, key = 'val') {    //传入两个数组,需要做环比的值,当环比无数据时为字段增加值为null
  const newData = [];
  for (let i = 0, len = arr_now.length; i < len; i++) {
    let item = arr_now[i];
    let size = arr_last.length;
    if (size > 0) {
      for (let j = 0; j < size; j++) {
        let obj = arr_last[j];
        if (item[groupId] === obj[groupId]) {
          let now_val = parseFloat(item[key]);
          let last_val = parseFloat(obj[key]);
          item['chain'] = parseFloat(((now_val - last_val) / last_val * 100).toFixed(2));
        } else if (j === size - 1) {
          item['chain'] = null;
        }
      }
    } else {
      item['chain'] = null;
    }
    newData.push(item)
  }
  return newData
}

export function dealWithRelativeData2(arr_now, arr_last, groupId, key = 'val') {    //传入两个数组,需要做环比的值,当环比无数据时为字段增加值为null
  const newData = [];
  for (let i = 0, len = arr_now.length; i < len; i++) {
    let item = arr_now[i];
    let size = arr_last.length;
    if (size > 0) {
      for (let j = 0; j < size; j++) {
        let obj = arr_last[j];
        if (item[groupId] === obj[groupId]) {
          let now_val = parseFloat(item[key]);
          let last_val = parseFloat(obj[key]);
          item['chain1'] = parseFloat(((now_val - last_val) / last_val * 100).toFixed(2));
        } else if (j === size - 1) {
          item['chain1'] = null;
        }
      }
    } else {
      item['chain1'] = null;
    }
    newData.push(item)
  }
  return newData
}

