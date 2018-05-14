export function formatDate(timestamp) { //设置时间转换格式
  let dateTime = new Date(timestamp);
  var y = dateTime.getFullYear();  //获取年
  var m = dateTime.getMonth() + 1;  //获取月
  m = m < 10 ? '0' + m : m;  //判断月是否大于10
  var d = dateTime.getDate();  //获取日
  d = d < 10 ? ('0' + d) : d;  //判断日期是否大10
  var a = ["日", "一", "二", "三", "四", "五", "六"];
  var week = dateTime.getDay(); //获取周
  var str = "周" + a[week];
  return y + '.' + m + '.' + d + ' ' + str;  //返回时间格式
}

export function weekMean(now) {    //计算周均数据为上周5到今天-1,
  let weeHours = new Date(now.setHours(0, 0, 0, 0));
  let endTime = new Date(weeHours - 86400000).valueOf();  //获取当天-1时间
  let weekNum = weeHours.getDay() === 0 ? 7 : now.getDay();
  let startTime = new Date(weeHours - (weekNum > 5 ? weekNum - 5 : weekNum + 2) * 86400000).valueOf();
  return {
    startTime,
    endTime,
  }
}

export function monthMean(now) {    //月均日期
  let weeHours = new Date(now.setHours(0, 0, 0, 0));
  let endTime = new Date(weeHours - 86400000).valueOf();  //获取当天-1时间
  let weekNum = weeHours.getDay() === 0 ? 7 : now.getDay();
  let startTime = new Date(weeHours - (weekNum > 5 ? weekNum + 16 : weekNum + 23) * 86400000).valueOf();
  return {
    startTime,
    endTime,
  }
}

export function isRequestRelative(params,action) {          //判断是否需要发送环比请求请求  params中需要传递startTime,endTime,dateType
  let startTime = params.startTime || null;
  let endTime = params.endTime || null;
  const dateTime = relativeRatio(startTime, endTime, params.dataType);
  const newParams = dateTime.startTime !== null || dateTime.endTime !== null ? {...params, ...dateTime} : null;
  return newParams;
}

export function relativeRatio(start, end, dataType = 1) {        //计算环比值,datatype值1:周均2:月均,3:自定义
  const TIME = new Date('2017.12.29 0:0:0').valueOf();       //时间最早追溯到2017.12.29,时间戳
  const s_time = Number(start);
  const e_time = Number(end);
  let startTime = null, endTime = null;
  switch (Number(dataType)) {
    case 1:
      startTime = checkOutTime(s_time, 7);
      endTime = checkOutTime(s_time, 1);
      break;
    case 2:
      startTime = checkOutTime(s_time, 28);
      endTime = checkOutTime(s_time, 1);
      break;
    case 3:
      startTime = (s_time * 2 - e_time) >= TIME ? (s_time * 2 - e_time) : null;
      endTime = checkOutTime(s_time, 1);
      break;
    default:
      break;
  }

  function checkOutTime(timeTamp, days) {
    return timeTamp - days * 24 * 3600000 >= TIME ? timeTamp - days * 24 * 3600000 : null;
  }

  return {startTime, endTime}
}
