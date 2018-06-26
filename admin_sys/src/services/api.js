import { stringify } from 'qs';
import request from '../utils/request';

const HOST = 'http://172.16.117.65:8084';

/*
以下接口为账号相关
* */
// 账号列表接口
export async function queryAccountList(params) {
  console.log(`/account/list?${stringify(params)}`);
  return request(`${HOST}/account/list?${stringify(params)}`, {
    method: 'GET',
    body: params,
  });
}

// 添加账号接口
export async function addAccount(params) {
  return request(`${HOST}/account/add?${stringify(params)}`, {
    method: 'POST',
    body: params,
  });
}
// 修改账号接口
export async function updateAccount(params) {
  return request(`${HOST}/account/update?${stringify(params)}`, {
    method: 'PUT',
    body: params,
  });
}
// 删除账号接口
export async function deleteAccount(params) {
  return request(`${HOST}/account/delete?${stringify(params)}`, {
    method: 'DELETD',
    body: params,
  });
}
/*
* 角色管理
* */
export async function getRoleInfo(params) {
  return request(`${HOST}/role/info`, {
    method: 'GET',
    body: params,
  });
}

/*
* 角色列表
* params：{roleId，orderType}
* */
export async function getRoleList(params) {
  return request(`${HOST}/role/list`, {
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
  return request(`${HOST}/privilege/listAll`, {
    method: 'GET',
    body: params,
  });
}
/*
* 角色删除
* params：{role}
* */
export async function getRoleDelete(params) {
  return request(`${HOST}/role/delete`, {
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
