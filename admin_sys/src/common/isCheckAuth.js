import pathToRegexp from 'path-to-regexp';
import { getAuthority } from '../utils/authority';

export function addRouteData(routerData = {}) {
  const menuData = getAuthority('admin_auth') || [];
  const returnRouteData = {};
  Object.keys(routerData).forEach(key => {
    let route = routerData[key];
    const pathRegexp = pathToRegexp(key);
    const pathObj = menuData.find(item => pathRegexp.test(`${item.resourceUrl}`)) || {};
    route = {
      ...route,
      name: pathObj.name || route.name || '',
    };
    returnRouteData[key] = route;
  });
  return returnRouteData;
}

export function checkPathname(path = '') {
  const data1 = getAuthority('admin_auth') || [];
  const pathRegexp = pathToRegexp(path);
  const menuKey = data1.find(key => pathRegexp.test(`${key.resourceUrl}`));
  if (menuKey) {
    return true;
  } else return false;
}
