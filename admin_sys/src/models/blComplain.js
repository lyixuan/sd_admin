import { message } from 'antd';
import { getBlComplainList, preDelBlComplainList, delBlComplainList } from '../services/api';

export default {
  namespace: 'blComplain',

  state: {
    getListParams: { size: 30, number: 0 },
    getList: [],
    nums: '',
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getBlComplainList, { ...getListParams });
      yield put({ type: 'save', payload: { response } });
    },
    *preDelComplain({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(preDelBlComplainList, { ...params });
      yield put({ type: 'savePreData', payload: { preDelData } });
    },
    *delComplain({ payload }, { call, put }) {
      const { params } = payload;
      const delData = yield call(delBlComplainList, { ...params });
      if (delData.code === 2000) {
        message.success('账号删除成功！');
      } else {
        message.error(delData.msg);
      }
      yield put({ type: 'savePreData', payload: { delData } });
    },
    *getNums({ payload }, { put }) {
      const { nums } = payload;
      yield put({ type: 'savePreData', payload: { nums } });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        getList: action.payload,
      };
    },
    savePreData(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
