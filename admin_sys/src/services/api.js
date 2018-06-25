import { stringify } from 'qs';
import request from '../utils/request';

const HOST = 'http://172.16.117.65:8084';

/*
以下接口为账号相关
* */
export async function queryAccountList(params) {
  console.log(`/account/list?${stringify(params)}`);
  return request(`${HOST}/account/list?${stringify(params)}`);
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
