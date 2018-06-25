// import { stringify } from 'qs';
import request from '../utils/request';

const HOST = 'http://172.16.117.65:8084';
/*
* 角色管理
* */
export async function getRoleInfo(params) {
  return request(`${HOST}/role/info`, {
    method: 'GET',
    body: params,
  });
}
