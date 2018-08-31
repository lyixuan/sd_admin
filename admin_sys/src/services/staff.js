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
