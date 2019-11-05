import pathToRegexp from 'path-to-regexp';
import storage from './storage';
import { CAS_HOST } from './constants';

export function redirectToLogin() {
  localStorage.clear();
  const { href } = window.location;
  const serverUrl = `${CAS_HOST}/tologin`;
  window.location.href = `${serverUrl}?originPage=${href}`;
}

export function casLogout() {
  localStorage.clear();
  const { href } = window.location;
  const logoutUrl = `${CAS_HOST}/apis/caslogout?`;

  const pageUrl = `pageUrl=${CAS_HOST}/tologin?originPage=${href}`;
  window.location.href = `${logoutUrl}${pageUrl}`;
}
export function casLogoutDev() {
  localStorage.clear();
  const { href } = window.location;
  window.location.href = `${href}`;
}

export function checkPathname(path = '') {
  const data1 = storage.getUserAuth() || [];
  const pathRegexp = pathToRegexp(path);
  const menuKey = data1.find(key => pathRegexp.test(`${key.resourceUrl}`));
  if (menuKey) {
    return true;
  } else return false;
}
