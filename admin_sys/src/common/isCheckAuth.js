import pathToRegexp from 'path-to-regexp';
import { getAuthority } from '../utils/authority';

export function checkAuth(authList, routeData) {
  const newRouterData = {};
  authList.forEach(item => {
    let router = routeData[item.resourceUrl];
    router = {
      ...router,
      name: item.name,
      authority: item.checked,
    };
    newRouterData[item.resourceUrl] = router;
  });
  return Object.assign({}, routeData, newRouterData);
}

export function checkPathname(path) {
  const data1 = getAuthority('admin_auth') || [];
  const pathRegexp = pathToRegexp(path);
  const menuKey = data1.find(key => pathRegexp.test(`${key.resourceUrl}`));
  if (menuKey) {
    return menuKey.checked;
  } else return true;
}
