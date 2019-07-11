// use localStorage to store the authority info, which might be sent from server in actual project.
import { ADMIN_USER, ADMIN_AUTH_LIST } from './constants';

export function getItem(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
export function getAuthority(key) {
  try {
    return getItem(key);
  } catch (e) {
    console.warn(`1${e}`);
  }
}
export function getUserInfo() {
  const userInfo = localStorage.getItem(ADMIN_USER);
  return userInfo ? JSON.parse(userInfo) : null;
}
export function getUserAuth() {
  return getAuthority(ADMIN_AUTH_LIST);
}
export function setAuthority(key, value) {
  try {
    return localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`2${e}`);
  }
}
export function removeStorge(key) {
  try {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  } catch (e) {
    console.warn(`3${e}`);
  }
}
// 使用seccion会话记录不进行免登陆账号的问题
export function setAuthoritySeccion(key, value) {
  try {
    return window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`4${e}`);
  }
}

// 判断是否需要重新登录
export function isRepeatLogin() {
  const userInfo = getUserInfo() || {};
  const userInfo_localStorage = getItem(ADMIN_USER) || {};
  if (userInfo) {
    return (
      userInfo.userId !== userInfo_localStorage.userId ||
      userInfo.token !== userInfo_localStorage.token
    );
  } else return false;
}
