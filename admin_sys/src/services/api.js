import { stringify } from 'qs';
import request from '../utils/request';

const HOST = 'http://172.16.117.65:8084';
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
* 用户退出登录接口
* params：{name，password}
* */
export async function userLogout(params) {
  return request(`${HOST}/token/login`, {
    method: 'POST',
    body: params,
  });
}

/*
以下接口为账号相关
* */
// 账号列表接口
export async function queryAccountList(params) {
  return request(`${HOST}/account/list?${stringify(params)}`, {
    method: 'GET',
    body: params,
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
  console.log(params);
  return request(`${HOST}/account/delete?${stringify(params)}`, {
    method: 'DELETE',
    body: params,
  });
}
/*
* 角色管理
* */
export async function getRoleInfo(params) {
  return request(`${HOST}/role/info?${stringify(params)}`, {
    method: 'GET',
    body: params,
  });
}

/*
* 角色列表
* params：{roleId，orderType}
* */
export async function getRoleList(params) {
  return request(`${HOST}/role/list?${stringify(params)}`, {
    method: 'GET',
    body: params,
  });
}
/*
* 角色添加
* params：{role}
* */
export async function getRoleAdd(params) {
  return request(`${HOST}/role/add`, {
    method: 'POST',
    body: params,
  });
}
/*
* 角色添加>角色权限
* params：{role:body}
* */
export async function getRoleListAll(params) {
  return request(`${HOST}/privilege/listAll?${stringify(params)}`, {
    method: 'GET',
    body: params,
  });
}
/*
* 角色删除
* params：{role}
* */
export async function getRoleDelete(params) {
  return request(`${HOST}/role/delete?${stringify(params)}`, {
    method: 'DELETE',
    body: params,
  });
}
/*
* 角色修改
* params：{role}
* */
export async function getRoleUpdate(params) {
  return request(`${HOST}/role/update`, {
    method: 'PUT',
    body: params,
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
// 修改权限接口
export async function updatePermission(params) {
  return request(`${HOST}/privilege/update`, {
    method: 'PUT',
    body: params,
  });
}
