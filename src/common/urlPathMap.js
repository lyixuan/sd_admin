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
    name: '编辑扣分倍数',
  },
  '/timeManage/unAddDate': {
    name: '不可用日期',
  },
  '/timeManage/deleteDate': {
    name: '删除不可用日期',
  },
  '/timeManage/updateArea': {
    name: '删除不可用日期',
  },
  '/user/updateUser': {
    name: '更新用户',
  },
  '/group/editeGroupShortName': {
    name: '编辑小组短名称',
  },
  '/college/editeCollegeShortName': {
    name: '编辑学院短名称',
  },
  '/family/editeFamilyShortName': {
    name: '编辑家族短名称',
  },
  '/performance/exportDetail': {
    name: '导出绩效详情',
  },
  '/performance/exportAmount': {
    name: '导出绩效金额',
  },
  '/bottomTable/addBottomTable': {
    name: '添加底表下载任务',
  },
  '/bottomTable/downloadBottomTable': {
    name: '底表下载',
  },
  '/bottomTable/downloadAllBottomTable': {
    name: '下载全部底表',
  },
};
export { urlPathMap };