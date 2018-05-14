import request from '../utils/request';
import { stringify } from 'qs';


export async function getStrickFirData(param) {
  return request('http://172.16.117.65:8083/operations/operationsList', {
    method: 'POST',
    body: param,
  });
}
export async function getStrickSecData(param) {
  return request('http://172.16.117.65:8083/operations/operationsDetail', {
    method: 'POST',
    body: param,
  });
}

export async function firstCreditList(param) {
  return request('/api/firstCreditList', {
    method: 'POST',
    body: param,
  });
}
export async function secCreditList(param) {
  return request('/api/secCreditList', {
    method: 'POST',
    body: param,
  });
}