import { message } from 'antd';
import { getSignUpMessage, saveSignUpMessage } from '../services/api';

export default {
  namespace: 'otherConfig',

  state: {
    // 接口返回数据存储
    messageText: null,
  },

  effects: {
    *getSignUpMessage(_, { call, put }) {
      const signUpData = yield call(getSignUpMessage);
      if (signUpData.code === 2000) {
        const data = signUpData.data || {};
        const messageText = data.message || null;
        yield put({ type: 'dataSave', payload: { messageText } });
      } else {
        message.error(signUpData.msg);
      }
    },
    *saveSignUpMessage({ payload }, { call, put }) {
      const response = yield call(saveSignUpMessage, { ...payload });
      if (response.code === 2000) {
        yield put({ type: 'getSignUpMessage' });
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    dataSave(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
