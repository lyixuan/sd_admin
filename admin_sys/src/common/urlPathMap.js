/** ***
 *name:菜单栏显示名字,pathname:对应url路径
 * @type {{/: {name: string, pathname: string}, /indexPage: {name: string, pathname: string}}}
 */
const urlPathMap = {
  '/account/del': {
    name: '账号删除',
  },
  '/indexPage': {
    name: '首页',
    pathname: '/indexPage',
  },
};
export { urlPathMap };
