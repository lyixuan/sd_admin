import { stringify } from 'qs';
import { parse } from 'url';

export function getUrlParams(app) {
  const { _history } = app;
  const { location = {} } = _history;
  return parse(location.search, true).query || {};
}
export function getLastUrlParams(app) {
  const { _store } = app;
  const { global = {} } = _store.getState();
  return global.lastUrlParams || {};
}
export function setCurrentUrlParams(query = null) {
  // 传入参数统一为对象
  const { pathname } = this.history.location;
  const originSearch = parse(this.history.location.search, true).query || null;
  const paramsObj = { ...originSearch, ...query };
  this.history.replace({
    pathname,
    search: stringify(paramsObj),
  });
}
export function setRouteUrlParams(pathname, query) {
  const assignQuery = { ...query };
  if (pathname) {
    this.history.push({
      pathname,
      search: stringify(assignQuery),
    });
  } else {
    console.warn('输入路径地址');
  }
}
export function getCurrentAuthInfo() {}
