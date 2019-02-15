import { message } from 'antd';
import { excellentList } from '../services/api';

export default {
  namespace: 'otherConfig',

  state: {
    // 接口返回数据存储
    getData: null,
  },

  effects: {
    *getSignUpMessage({ payload }, { call, put }) {
      const signUpData = yield call(excellentList, payload.params);
      if (signUpData.code === 2000) {
        const getData = signUpData.data || [];
        yield put({ type: 'dataSave', payload: { getData } });
      } else {
        message.error(signUpData.msg);
      }
    },
  },

  reducers: {
    dataSave(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
