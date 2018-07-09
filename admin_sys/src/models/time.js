import { message } from 'antd';
import { getDate } from '../services/api';

export default {
  namespace: 'time',

  state: {
    dateListObj: {},
  },

  effects: {
    *getDates({ payload }, { call, put }) {
      const reponse = yield call(getDate, { ...payload });
      const dateListObj = reponse.data || {};
      yield put({
        type: 'saveDateList',
        payload: { dateListObj },
      });
      if (reponse.code !== 2000) {
        message.error(dateListObj.msg);
      }
    },
    // *updateTimeArea({ payload }, { put, call }) {
    //   const { paramsObj } = payload;
    // },
  },

  reducers: {
    saveDateList(state, { payload }) {
      return { ...state, ...payload };
    },
    saveTimeArea(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
