// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getRangeDate, getDate, bottomTableList, downLoadBT, addTask } from '../services/api';

export default {
  namespace: 'bottomTable',

  state: {
    // 接口返回数据存储
    dataList: [{ ordId: 2 }],
    disDateList: [],
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
      const reponse = yield call(bottomTableList, { ...payload });
      const dataList = reponse.data || {};
      if (reponse.code !== 2000) {
        message.error(reponse.msg);
      } else {
        yield put({
          type: 'bottomTableSave',
          payload: { dataList },
        });
      }
    },
    // 添加底表
    *addTask({ payload }, { call }) {
      const reponse = yield call(addTask, { ...payload });
      if (reponse.code !== 2000) {
        message.error(reponse.msg);
      } else {
        console.log(reponse.data);
      }
    },
    // 下载底表
    *downLoadBT({ payload }, { call }) {
      const reponse = yield call(downLoadBT, { ...payload });
      if (reponse.code !== 2000) {
        message.error(reponse.msg);
      } else {
        console.log(reponse.data);
      }
    },
    // 不可选时间列表
    *getDates({ payload }, { call, put }) {
      const reponse = yield call(getDate, { ...payload });
      const disDateList = reponse.data || {};
      yield put({
        type: 'saveTime',
        payload: { disDateList },
      });
      if (reponse.code !== 2000) {
        message.error(reponse.msg);
      }
    },
    // 时间区间
    *getRange(_, { call, put }) {
      const response = yield call(getRangeDate);
      if (response.code === 2000) {
        const [dateArea] = response.data || [];
        console.log(dateArea);
        yield put({
          type: 'saveTime',
          payload: { dateArea },
        });
      }
    },
  },

  reducers: {
    bottomTableSave(state, { payload }) {
      return { ...state, ...payload };
    },
    saveTime(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
