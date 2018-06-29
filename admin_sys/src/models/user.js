
import {
  userList,
} from '../services/api';

export default {
  namespace: 'user',

  state: {
    // 接口返回数据存储
    userList: [],
  },

  effects: {
    *userList({ payload }, { call, put }) {
      const response = yield call(userList, payload.userListParams);
      console.log(response)
      yield put({ type: 'userListSave', payload: { response } });
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
