import { message } from 'antd';
import {
  packageList,
  // packageInfo,
} from '../services/api';

export default {
  namespace: 'coefficient',

  state: {
    // 接口返回数据存储
    userList: [],
    wechatList: [],
    listOrg: [],
    getUserlistData: null,
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
  },

  reducers: {
    packageListSave(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
