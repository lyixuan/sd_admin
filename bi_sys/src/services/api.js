import request from '../utils/request';
import {stringify} from 'qs';
const HOST='http://172.16.117.65:8083';
export async function getCreditRankAvgList(params) {

  return request('http://172.16.117.65:8083/credit/findAvgCredit', {    //排名接口
    method: 'POST',
    body: params,
  });
}
export async function getCreditCompanyAvgList(params) {                 //集团均分趋势接口
  return request('http://172.16.117.65:8083/trend/creditCompanyAvgList', {
    method: 'POST',
    body: params,
  });
}
export async function getCreditTrendAvgList(params) {                 //获取分组均分趋势接口
  return request(`${HOST}/trend/creditTrendAvgList`, {
    method: 'POST',
    body: params,
  });
}

export async function getCreditTrendObjList(params) {                 //获取分组均分趋势接口
  return request(`${HOST}/trend/creditTrendObjList`, {
    method: 'POST',
    body: params,
  });
}

export async function getCreditDementionList(params) {
  //return request('/api/creditDementionList', {
  return request('http://172.16.117.65:8083/dimension/creditDementionList', {
    method: 'POST',
    body: params,
  });
}

export async function getQueryCreditTrend(params) {
  // return request('/api/queryCreditTrend', {
  return request('http://172.16.117.65:8083/dimension/queryCreditTrend', {
    method: 'POST',
    body: params,
  });
}

export async function getdementionTypeList(params) {
    return request('/api/dementionTypeList', {
  // return request('http://172.16.58.248:8083/details/dementionTypeList', {
    method: 'POST',
    body: params,
  });
}

export async function getOrgMap(params) {
  return request('http://172.16.117.65:8083/organization/findOrgMap', {
    method: 'GET',
    body: params,
  });
}

// export async function getQueryTrendAll(params) {
//   return request('/api/queryTrendAll', {
//     method: 'POST',
//     body: params,
//   });
// }

// export async function getCreditCompanyAvgList(params) {
//   return request(`/api/creditCompanyAvgList?${stringify(params)}`);
// }

export async function fakeSubmitForm(params) {
  return request('http://172.16.117.65:8083/wechatLogin/getUserByCode', {
    method: 'POST',
    body: params,
  });
}
