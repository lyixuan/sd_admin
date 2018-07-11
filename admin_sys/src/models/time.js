import { message } from 'antd';
import { getDate, addDate, deleteDate, updateDate } from '../services/api';

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
        message.error(reponse.msg);
      }
    },
    *addDisableTime({ payload }, { put, call }) {
      const { dateTime, params } = payload;
      const response = yield call(addDate, { dateTime });
      if (response.code === 2000) {
        message.success('添加成功');
        const listData = yield call(getDate, { ...params });
        const dateListObj = listData.data || {};
        yield put({
          type: 'saveDateList',
          payload: { dateListObj },
        });
      }
    },
    *deleteTime({ payload }, { put, call }) {
      const { id, params } = payload;
      const reponse = yield call(deleteDate, { id });
      if (reponse.code === 2000) {
        message.success('删除成功');
        const listData = yield call(getDate, { ...params });
        const dateListObj = listData.data || {};
        yield put({
          type: 'saveDateList',
          payload: { dateListObj },
        });
      }
    },
    *updateAreaDate({ payload }, { call }) {
      const response = yield call(updateDate, { ...payload });
      if (response.code === 2000) {
        message.success('设置日期成功');
      } else {
        message.error(response.msg);
      }
    },
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
