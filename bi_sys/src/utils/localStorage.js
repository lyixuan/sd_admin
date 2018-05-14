export function getItem() {
  const userInfo = window.localStorage.getItem('userInfo');
  return userInfo === null ? null : JSON.parse(userInfo);
}

export function setItem(info) {
  info === undefined && console.warn('请传入存储的值');
  window.localStorage.setItem('userInfo', JSON.stringify(info));
}
