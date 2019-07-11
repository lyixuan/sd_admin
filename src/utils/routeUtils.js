import pathToRegexp from 'path-to-regexp';
import storage from './storage';
import { CAS_HOST } from './constants';

export function redirectToLogin() {
  const { origin } = window.location;
  const serverUrl = `${CAS_HOST}/tologin`;
  window.location.href = `${serverUrl}?originPage=${origin}`;
}

export function casLogout() {
  const { origin } = window.location;
  const logoutUrl = `${CAS_HOST}/apis/caslogout?`;

  const pageUrl = `pageUrl=${CAS_HOST}/tologin?originPage=${origin}`;
  window.location.href = `${logoutUrl}${pageUrl}`;
}

export function checkPathname(path = '') {
  const data1 = storage.getUserAuth() || [];
  const pathRegexp = pathToRegexp(path);
  const menuKey = data1.find(key => pathRegexp.test(`${key.resourceUrl}`));
  if (menuKey) {
    return true;
  } else return false;
}
