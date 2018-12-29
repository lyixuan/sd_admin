// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(key) {
  try {
    const value = localStorage.getItem(key) || sessionStorage.getItem(key);
    return value ? JSON.parse(value) : value;
  } catch (e) {
    alert('读取本地存储失败,请检查浏览器对存储的设置');
  }
}

export function setAuthority(key, value) {
  try {
    return localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    alert('读取本地存储失败,请检查浏览器对存储的设置');
  }
}
export function removeStorge(key) {
  try {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  } catch (e) {
    alert('读取本地存储失败,请检查浏览器对存储的设置');
  }
}
// 使用seccion会话记录不进行免登陆账号的问题
export function setAuthoritySeccion(key, value) {
  try {
    return window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    alert('读取本地存储失败,请检查浏览器对存储的设置');
  }
}
