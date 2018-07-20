import { stringify } from 'qs';
import request from '../utils/request';
import config from '../config';

const { NODE_ENV = 'pro' } = config;
const hostObj = {
  pro: 'http://bd.ministudy.com',
  dev: 'http://test-api.bd.ministudy.com',
};
const HOST = hostObj[NODE_ENV];
/*
* 用户登录接口
* params：{name，password}
* */
export async function userLogin(params) {
  return request(`${HOST}/token/login`, {
    method: 'POST',
    body: params,
  });
}
/*
* 获取用户登录信息
* params：{id}
* */
export async function queryCurrentUser(params) {
  return request(`${HOST}/account/info?${stringify(params)}`, {
    method: 'GET',
  });
}
/*
* 用户退出登录接口
* params：{name，password}
* */
export async function userLogout(params) {
  return request(`${HOST}/token/logout`, {
    method: 'POST',
    body: params,
  });
}
/*
* 用户修改登录密码
* params：{id，oldPassword,password}
* */
export async function updatePwd(params) {
  return request(`${HOST}/account/updatePwd`, {
    method: 'PUT',
    body: params,
  });
}
/*
* 用户重置登录密码
* params：{userd，oldPassword,password,token}
* */
export async function resetPwd(params) {
  return request(`${HOST}/account/resetPwd`, {
    method: 'PUT',
    body: params,
  });
}
/*
 *忘记密码,向邮箱里面发送邮件接口
 * params:{mail}
 */
export async function findBackPwd(params) {
  return request(`${HOST}/account/findBackPwd?${stringify(params)}`, {
    method: 'GET',
  });
}
/*
 *获取验证码接口,不需要加验证,使用tag请求
 * params:{}
 */
export async function generateAuthCode(params) {
  const image = new Image();
  image.src = `${HOST}/token/generateAuthCode?${stringify(params)}`;
  return image.src;
}
/*
 *获取获取用户登录权限
 * params:{id}  userId
 */
export async function getUserAuth(params) {
  return request(`${HOST}/rolePrivilege/getPrivilegeByAccountId?${stringify(params)}`, {
    method: 'GET',
  });
}
/*
以下接口为账号相关
* */
// 账号列表接口
export async function queryAccountList(params) {
  return request(`${HOST}/account/list?${stringify(params)}`, {
    method: 'GET',
  });
}

// 查询单个账号的信息
export async function queryAccountInfo(params) {
  return request(`${HOST}/account/info?${stringify(params)}`, {
    method: 'GET',
  });
}

// 添加账号接口
export async function addAccount(params) {
  return request(`${HOST}/account/add`, {
    method: 'POST',
    body: params,
  });
}
// 修改账号接口
export async function updateAccount(params) {
  return request(`${HOST}/account/update`, {
    method: 'PUT',
    body: params,
  });
}
// 删除账号接口
export async function deleteAccount(params) {
  return request(`${HOST}/account/delete?${stringify(params)}`, {
    method: 'DELETE',
  });
}

// 查询角色下拉列表
export async function getRolePrivilegesList(params) {
  return request(`${HOST}/rolePrivilege/list?${stringify(params)}`, {
    method: 'GET',
  });
}

/*
* 短名称管理
* */
// 学院
export async function getCollegeList(params) {
  return request(`${HOST}/sn/listCollege?${stringify(params)}`, {
    method: 'GET',
  });
}
export async function updateCollege(params) {
  return request(`${HOST}/sn/updateCollege`, {
    method: 'PUT',
    body: params,
  });
}
// 家族
export async function getFamilyList(params) {
  return request(`${HOST}/sn/listFamily?${stringify(params)}`, {
    method: 'GET',
  });
}
export async function updateFamily(params) {
  return request(`${HOST}/sn/updateFamily`, {
    method: 'PUT',
    body: params,
  });
}
// 小组
export async function getGroupList(params) {
  return request(`${HOST}/sn/listGroup?${stringify(params)}`, {
    method: 'GET',
  });
}
export async function updateGroup(params) {
  return request(`${HOST}/sn/updateGroup`, {
    method: 'PUT',
    body: params,
  });
}

/*
* 角色管理
* */
export async function getRoleInfo(params) {
  return request(`${HOST}/role/info?${stringify(params)}`, {
    method: 'GET',
  });
}

/*
* 角色列表
* params：{roleId，orderType}
* */
export async function getRoleList(params) {
  return request(`${HOST}/role/list?${stringify(params)}`, {
    method: 'GET',
  });
}
/*
* 角色添加
*  params：{
*   "name": "string",
*   "privilegeIds": [1]
* }
* */
export async function getRoleAdd(params) {
  return request(`${HOST}/role/add`, {
    method: 'POST',
    body: params,
  });
}
/*
* 角色添加>角色权限
* params：{name}
* */
export async function getRoleListAll(params) {
  return request(`${HOST}/privilege/listAllName?${stringify(params)}`, {
    method: 'GET',
  });
}
/*
* 角色删除
* params：{id}
* */
export async function getRoleDelete(params) {
  return request(`${HOST}/role/delete?${stringify(params)}`, {
    method: 'DELETE',
  });
}
/*
* 角色修改
* params：{
*   "id": 0,
*   "name": "string",
*   "privilegeIds": [1]
* }
* */
export async function getRoleUpdate(params) {
  return request(`${HOST}/role/update`, {
    method: 'PUT',
    body: params,
  });
}
/*
* 角色编辑>角色权限回显
* params：{id}
* */
export async function getRolePrivileges(params) {
  return request(`${HOST}/rolePrivilege/getRolePrivileges?${stringify(params)}`, {
    method: 'GET',
  });
}

/*
以下接口为权限相关
* */
// 添加权限接口
export async function addPermission(params) {
  return request(`${HOST}/privilege/add`, {
    method: 'POST',
    body: params,
  });
}
// 根据ID查询对应权限
export async function getPermissionById(params) {
  return request(`${HOST}/privilege/getPrivilegeById?${stringify(params)}`, {
    method: 'GET',
  });
}
// 修改权限接口
export async function updatePermission(params) {
  return request(`${HOST}/privilege/update`, {
    method: 'PUT',
    body: params,
  });
}
// 查询权限列表接口
export async function roleList(params) {
  return request(`${HOST}/privilege/listAll?${stringify(params)}`, {
    method: 'GET',
  });
}

// 查询上级权限列表接口
export async function permissionListAllName(params) {
  return request(`${HOST}/privilege/listAllName?${stringify(params)}`, {
    method: 'GET',
  });
}

/*
以下接口为用户管理模块相关
* */
// 查询用户列表
export async function userList(params) {
  return request(`${HOST}/user/list?${stringify(params)}`, {
    method: 'GET',
  });
}
// 更新用户组织结构  慧慧提示该put接口要在url后面添加参数
export async function updateUserOrg(params) {
  return request(`${HOST}/user/updateOrg`, {
    method: 'PUT',
    body: params,
  });
}
// 更新用户信息 慧慧提示该put接口要在url后面添加参数
export async function updateUserInfo(params) {
  return request(`${HOST}/user/updateUserInfo`, {
    method: 'PUT',
    body: params,
  });
}
// 删除用户
export async function userDelete(params) {
  return request(`${HOST}/user/delete?${stringify(params)}`, {
    method: 'DELETE',
  });
}
// 创建用户
export async function userAdd(params) {
  return request(`${HOST}/user/add`, {
    method: 'POST',
    body: params,
  });
}
// 负责单位列表
export async function listOrg(params) {
  return request(`${HOST}/user/listOrg?${stringify(params)}`, {
    method: 'GET',
  });
}
// 查看微信部门
export async function wechatList(params) {
  return request(`${HOST}/user/wechatList?${stringify(params)}`, {
    method: 'GET',
  });
}

/*
以下接口为投诉翻倍模块相关
* */
// 投诉扣分倍数列表
export async function complaintDoublesList(params) {
  return request(`${HOST}/complainMultiple/list?${stringify(params)}`, {
    method: 'GET',
  });
}
// 修改投诉扣分倍数
export async function upateComplaintDoubles(params) {
  return request(`${HOST}/complainMultiple/update`, {
    method: 'PUT',
    body: params,
  });
}

/*
获取不可选时间列表
 */
export async function getDate(params) {
  return request(`${HOST}/time/getDate?${stringify(params)}`, {
    method: 'GET',
  });
}
/*
删除不可选时间
 */
export async function deleteDate(params) {
  return request(`${HOST}/time/deleteDate?${stringify(params)}`, {
    method: 'DELETE',
  });
}
/*
增加不可选时间
 */
export async function addDate(params) {
  return request(`${HOST}/time/addDate`, {
    method: 'POST',
    body: params,
  });
}
/*
更新可见日期
 */
export async function updateDate(params) {
  return request(`${HOST}/time/updateDate`, {
    method: 'PUT',
    body: params,
  });
}
/*
设置可选日期区间回显
 */
export async function getRangeDate(params) {
  return request(`${HOST}/time/getRange?${stringify(params)}`, {
    method: 'GET',
  });
}

/*
以下接口为投诉管理模块相关
* */
// 投诉列表
export async function getBlComplainList(params) {
  return request(`${HOST}/blComplain/list?${stringify(params)}`, {
    method: 'GET',
  });
}
// 校验质检excel文件
export async function checkComplainList(params) {
  return request(`${HOST}/blComplain/verifyDataFromExcel`, {
    method: 'POST',
    body: params,
  });
}
// 确定excel文件数据插入数据库
export async function saveDataComplain(params) {
  return request(`${HOST}/blComplain/saveDatas`, {
    method: 'POST',
    body: params,
  });
}
// 预删除投诉列表
export async function preDelBlComplainList(params) {
  return request(`${HOST}/blComplain/preDelete`, {
    method: 'POST',
    body: params,
  });
}
// 删除投诉列表
export async function delBlComplainList(params) {
  return request(`${HOST}/blComplain/confirmDelete`, {
    method: 'POST',
    body: params,
  });
}

/*
* 质检模块接口
* */

// 质检单列表
export async function getQualityList(params) {
  return request(`${HOST}/metaQuality/list?${stringify(params)}`, {
    method: 'GET',
  });
}
// 校验质检excel文件
export async function checkQualityList(params) {
  return request(`${HOST}/metaQuality/verifyDataFromExcel`, {
    method: 'POST',
    body: params,
  });
}
// 确定excel文件数据插入数据库
export async function saveDataQuality(params) {
  return request(`${HOST}/metaQuality/saveDatas`, {
    method: 'POST',
    body: params,
  });
}
// 预删除质检列表
export async function preDelQualityList(params) {
  return request(`${HOST}/metaQuality/preDelete`, {
    method: 'POST',
    body: params,
  });
}
// 删除质检列表
export async function delQualityList(params) {
  return request(`${HOST}/metaQuality/confirmDelete`, {
    method: 'POST',
    body: params,
  });
}
// 上传图片地址
export function qualityUpload() {
  return `${HOST}/metaQuality/uploadFile`;
}

/*
* 退费模块接口
* */
export async function getBlRefundList(params) {
  return request(`${HOST}/blRefund/list?${stringify(params)}`, {
    method: 'GET',
  });
}
// 校验退费excel文件
export async function checkRefundList(params) {
  return request(`${HOST}/blRefund/verifyDataFromExcel`, {
    method: 'POST',
    body: params,
  });
}
// 确定excel文件数据插入数据库
export async function saveDataRefund(params) {
  return request(`${HOST}/blRefund/saveDatas`, {
    method: 'POST',
    body: params,
  });
}
// 预删除投诉列表
export async function preDelBlRefundList(params) {
  return request(`${HOST}/blRefund/preDelete`, {
    method: 'POST',
    body: params,
  });
}
// 删除投诉列表
export async function delBlRefundList(params) {
  return request(`${HOST}/blRefund/confirmDelete`, {
    method: 'POST',
    body: params,
  });
}
