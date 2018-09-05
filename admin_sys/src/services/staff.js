import { stringify } from 'qs';
import request from '../utils/request';
import { HOST } from './api';

/*
* 获取员工管理列表
* params：{name,mail,number,size,orderType,status}
* */
export async function getStaffList(params) {
  return request(`${HOST}/employee/list?${stringify(params)}`, {
    method: 'GET',
  });
}
/*
* 插卡
* params：{id}
* */
export async function getStaffDetail(params) {
  return request(`${HOST}/detail/detail?${stringify(params)}`, {
    method: 'GET',
  });
}
/*
* 根据员工id和type查询该员工相关信息
* params：{id,type}
* */
export async function getEmployeeInfo(params) {
  return request(`${HOST}/employee/getEmployeeInfo?${stringify(params)}`, {
    method: 'GET',
  });
}
/*
* 添加转岗接口
* params：{}
* */
export async function addTransferPost(params) {
  return request(`${HOST}/employee/addTransferPost`, {
    method: 'POST',
    body: params,
  });
}
/*

* 编辑转岗接口
* params：{}
* */
export async function updateTransferPost(params) {
  return request(`${HOST}/employee/updateTransferPost`, {
    method: 'POST',
    body: params,
  });
}
/*
* 添加离职接口
* params：{}
* */
export async function addDemissionPost(params) {
  return request(`${HOST}/employee/addDemission`, {
    method: 'POST',
    body: params,
  });
}
/*
* 编辑离职接口
* params：{}
* */
export async function editDemissionPost(params) {
  return request(`${HOST}/employee/updateDemission`, {
    method: 'POST',
    body: params,
  });
}
