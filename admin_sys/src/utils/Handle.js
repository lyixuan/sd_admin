import { stringify } from 'qs';
import { parse } from 'url';
import { message } from 'antd';

/*
* 此方法用于操作成功,全局提示,并跳转到指定页面
* @params  {object} params
* {string|node} params.content  提示内容
* {string} params.pathname      跳转路径
* {object} params.query         路由参数
* */
export function handleSuccess(params) {
  const { content = '操作成功', pathname = window.location.pathname, query = {} } = params;
  const { search, origin } = window.location;
  const originSearch = parse(search, true).query || null;
  const paramsObj = { ...originSearch, ...query };
  const url = `${origin}${pathname}?${stringify(paramsObj)}`;
  message.success(content, () => {
    window.location.href = url;
  });
}
