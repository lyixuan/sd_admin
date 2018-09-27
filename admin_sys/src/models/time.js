import { message } from 'antd';
import {
  getDate,
  addDate,
  deleteDate,
  updateDate,
  getRangeDate,
  getKpiEffectMonth,
  updateKpiEffectMonth,
} from '../services/api';

export default {
  namespace: 'time',

  state: {
    dateListObj: {},
    dateArea: {
      beginTime: '',
      endTime: '',
      id: 1,
    },
    kpiEffectMonthList: [],
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
    *getRange(_, { call, put }) {
      const response = yield call(getRangeDate);
      if (response.code === 2000) {
        const [dateArea] = response.data || [];
        yield put({
          type: 'saveTimeArea',
          payload: { dateArea },
        });
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
    *getKpiEffectMonth(_, { put, call }) {
      const response = yield call(getKpiEffectMonth);
      if (response.code === 2000) {
        const kpiEffectMonthList = response.data || [];
        yield put({
          type: 'saveKpiEffectMonth',
          payload: { kpiEffectMonthList },
        });
      }
    },
    *updateKpiEffectMonth({ payload }, { put, call }) {
      const response = yield call(updateKpiEffectMonth, payload);
      if (response.code === 2000) {
        message.success('设置成功');
        const list = yield call(getKpiEffectMonth);
        if (list.code === 2000) {
          const kpiEffectMonthList = list.data || [];
          yield put({
            type: 'saveKpiEffectMonth',
            payload: { kpiEffectMonthList },
          });
        }
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    saveKpiEffectMonth(state, { payload }) {
      return { ...state, ...payload };
    },
    saveDateList(state, { payload }) {
      return { ...state, ...payload };
    },
    saveTimeArea(state, { payload }) {
      // const [rangeDate]=payload
      return { ...state, ...payload };
    },
  },
};
