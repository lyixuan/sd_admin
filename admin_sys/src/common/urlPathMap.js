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
  '/account/deleteAccout': {
    name: '账号删除',
  },
  '/user/deleteUser': {
    name: '用户删除',
  },
  '/complaintDoubles/editecomplaintDoubles': {
    name: '投诉翻倍编辑',
  },
  '/timeManage/unAddDate': {
    name: '不可选日期',
  },
};
export { urlPathMap };
