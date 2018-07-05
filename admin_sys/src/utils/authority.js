// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(key) {
  const value = localStorage.getItem(key) || sessionStorage.getItem(key);
  return value ? JSON.parse(value) : value;
}

export function setAuthority(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}
export function removeStorge(key) {
  window.localStorage.removeItem(key);
  window.sessionStorage.removeItem(key);
}
// 使用seccion会话记录不进行免登陆账号的问题
export function setAuthoritySeccion(key, value) {
  return window.sessionStorage.setItem(key, JSON.stringify(value));
}
