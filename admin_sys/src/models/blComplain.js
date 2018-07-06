import { message } from 'antd';
import { getBlComplainList, preDelBlComplainList, delBlComplainList } from '../services/api';

export default {
  namespace: 'blComplain',

  state: {
    getListParams: { size: 30, number: 0 },

    getList: [],
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getBlComplainList, { ...getListParams });
      console.log(response);
      yield put({ type: 'save', payload: { response } });
    },
    *perDelComplain({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(preDelBlComplainList, { ...params });
      yield put({ type: 'savePreData', payload: { preDelData } });
    },
    *delComplain({ payload }, { call }) {
      console.log(payload.deleteAccountParams);
      const result = yield call(delBlComplainList, payload.deleteAccountParams);
      if (result.code === 0 || result.code === 2000) {
        message.success('账号删除成功！');
      } else {
        message.error(result.msg);
      }
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
      const { preDelData } = action.payload;
      return { ...state, preDelData };
    },
  },
};
