import { message } from 'antd';
import {
  packageList,
  packageInfo,
} from '../services/api';

export default {
  namespace: 'coefficient',
  state: {
  },

  effects: {
    *packageList({ payload }, { call, put }) {
      const response = yield call(packageList, payload.userListParams);
      if (response.code === 2000) {
        const { data = {} } = response;
        yield put({ type: 'packageListSave', payload: { data } });
      } else {
        message.error(response.msg);
      }
    },
    *packageInfo({ payload }, { call, put }) {
      const response = yield call(packageInfo, payload.userListParams);
      if (response.code === 2000) {
        const { data = {} } = response;
        yield put({ type: 'packageInfoSave', payload: { data } });
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    packageListSave(state, action) {
      return { ...state, ...action.payload };
    },
    packageInfoSave(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
