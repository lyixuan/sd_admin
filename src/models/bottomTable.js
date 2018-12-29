import { message } from 'antd';
import {
  getRangeDate,
  getDate,
  bottomTableList,
  downLoadBT,
  addTask,
  findAllOrg,
} from '../services/api';

function tagLoad(blob, name) {
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.click();
}
function blobFileLoad(result) {
  const promise = new Promise((res, err) => {
    const reader = new FileReader();
    reader.onload = e => {
      // if (e.target.result.indexOf('code') === -1 || JSON.parse(e.target.result).code !== 2000) {
      if (typeof result === 'object' && result.type) {
        res(result);
      } else {
        err(JSON.parse(e.target.result));
      }
    };
    reader.readAsText(result);
  });
  return promise;
}

export default {
  namespace: 'bottomTable',

  state: {
    // 接口返回数据存储
    dataList: [],
    disDateList: [],
    findAllOrg: [], // 所有学院列表
    totalNum: 0, // 总条数
    addbottomTableData: null,
    dateArea: {
      beginTime: '',
      endTime: '',
      id: 1,
    },
  },

  effects: {
    // 底表列表
    *bottomTableList({ payload }, { call, put }) {
      const response = yield call(bottomTableList, { ...payload });
      const dataList = response.data || {};
      if (response.code !== 2000) {
        message.error(response.msg);
      } else {
        yield put({
          type: 'bottomTableSave',
          payload: { dataList: dataList.content, totalNum: dataList.totalElements },
        });
      }
    },
    // 所有学院列表
    *findAllOrg(_, { call, put }) {
      const response = yield call(findAllOrg);
      if (response.code !== 2000) {
        message.error(response.msg);
      } else {
        yield put({
          type: 'bottomTableSave',
          payload: { findAllOrg: response.data },
        });
      }
    },
    // 添加底表
    *addTask({ payload }, { call, put }) {
      const { addParams, listParams } = payload;
      const response = yield call(addTask, addParams);
      if (response.code !== 2000) {
        message.error(response.msg);
      } else {
        message.success('添加任务成功！');
        const responseList = yield call(bottomTableList, listParams);
        const dataList1 = responseList.data || {};
        if (responseList.code !== 2000) {
          message.error(responseList.msg);
        } else {
          yield put({
            type: 'bottomTableSave',
            payload: { dataList: dataList1.content, totalNum: dataList1.totalElements },
          });
        }
      }
    },
    // 下载底表
    *downLoadBT({ payload }, { call }) {
      const { id, taskName } = payload;
      const response = yield call(downLoadBT, { id });
      blobFileLoad(response).then(
        blob => {
          tagLoad(blob, taskName);
        },
        err => {
          console.log(err);
          message.error(err.msg);
        }
      );
      // yield call(tagLoad, response, taskName);
    },
    // 不可选时间列表
    *getDates({ payload }, { call, put }) {
      const response = yield call(getDate, { ...payload });
      const disDateList = response.data || {};
      yield put({
        type: 'saveTime',
        payload: { disDateList },
      });
      if (response.code !== 2000) {
        message.error(response.msg);
      }
    },
    // 时间区间
    *getRange(_, { call, put }) {
      const response = yield call(getRangeDate);
      if (response.code === 2000) {
        const [dateArea] = response.data || [];
        yield put({
          type: 'saveTime',
          payload: { dateArea },
        });
      }
    },
  },

  reducers: {
    bottomTableSave(state, { payload }) {
      const { dataList } = payload;
      if (dataList) {
        dataList.forEach((item, i) => {
          dataList[i].key = i;
        });
      }
      return { ...state, ...payload };
    },
    saveTime(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
