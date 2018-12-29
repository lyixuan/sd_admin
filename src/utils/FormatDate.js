export function formatDate(timestamp) {
  // 设置时间转换格式
  const dateTime = new Date(Number(timestamp));
  const y = dateTime.getFullYear(); // 获取年
  let m = dateTime.getMonth() + 1; // 获取月
  m = m < 10 ? `0${m}` : m; // 判断月是否大于10
  let d = dateTime.getDate(); // 获取日
  d = d < 10 ? `0${d}` : d; // 判断日期是否大10
  let hour = dateTime.getHours();
  hour = hour < 10 ? `0${hour}` : hour; // 判断小时是否大于10
  let minute = dateTime.getMinutes();
  minute = minute < 10 ? `0${minute}` : minute; // 判断分钟是否大于10
  let second = dateTime.getSeconds();
  second = second < 10 ? `0${second}` : second; // 判断秒是否大于10
  return `${y}-${m}-${d} ${hour}:${minute}:${second}`; // 返回时间格式
}

export function formatDateNew(timestamp) {
  // 设置时间转换格式
  const dateTime = new Date(Number(timestamp));
  const y = dateTime.getFullYear(); // 获取年
  let m = dateTime.getMonth() + 1; // 获取月
  m = m < 10 ? `0${m}` : m; // 判断月是否大于10
  let d = dateTime.getDate(); // 获取日
  d = d < 10 ? `0${d}` : d; // 判断日期是否大10
  return `${y}-${m}-${d}`; // 返回时间格式
}

export function formatYeatMonth(timestamp) {
  // 设置时间转换格式
  const dateTime = new Date(Number(timestamp));
  const y = dateTime.getFullYear(); // 获取年
  let m = dateTime.getMonth() + 1; // 获取月
  m = m < 10 ? `0${m}` : m; // 判断月是否大于10
  return `${y}.${m}`; // 返回时间格式
}
