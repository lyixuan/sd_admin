// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  userList,
} from '../services/api';

export default {
  namespace: 'audit',

  state: {
    // 接口返回数据存储
    userList: {},
  },

  effects: {
    *userList({ payload }, { call, put }) {
      const response = yield call(userList, payload.userListParams);
      if (response.code === 2000) {
        const userListData = response.data || [];
        yield put({ type: 'userListSave', payload: { userListData } });
      } else {
        message.error(response.msg);
      }
    },

  },

  reducers: {

    userListSave(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },

  },
};
