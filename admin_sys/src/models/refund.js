import { getBlRefundList, preDelBlRefundList, delBlRefundList } from '../services/api';

export default {
  namespace: 'refund',

  state: {},

  effects: {
    *refundList({ payload }, { call, put }) {
      const { params } = payload;
      const listData = yield call(getBlRefundList, { ...params });
      yield put({ type: 'save', payload: { listData } });
    },
    *preDelRefund({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(preDelBlRefundList, { ...params });
      yield put({ type: 'save', payload: { preDelData } });
    },
    *delRefund({ payload }, { call, put }) {
      const { params } = payload;
      const delData = yield call(delBlRefundList, { ...params });
      yield put({ type: 'save', payload: { delData } });
    },
    *getNums({ payload }, { put }) {
      const { nums } = payload;
      yield put({ type: 'save', payload: { nums } });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
