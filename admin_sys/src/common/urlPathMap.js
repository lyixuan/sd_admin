/** ***
 *name:菜单栏显示名字,pathname:对应url路径
 * @type {{/: {name: string, pathname: string}, /indexPage: {name: string, pathname: string}}}
 */
const urlPathMap = {
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
  '/complaintDoubles/editeComplaintDoubles': {
    name: '编辑投诉倍数',
  },
  '/timeManage/unAddDate': {
    name: '不可选日期',
  },
  '/user/updateUser': {
    name: '更新用户',
  },
};
export { urlPathMap };
