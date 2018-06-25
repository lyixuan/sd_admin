import { getRoleInfo } from '../services/api';

export default {
  namespace: 'role',

  state: {
    dataList: [],
    params: [],
    currentUser: {},
  },

  effects: {
    *roleList({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const dataList = yield call(getRoleInfo, { ...paramsObj });
      console.log(dataList);
      yield put({
        type: 'saveRoleList',
        payload: dataList,
      });
    },
    *fetchCurrent(_, { put }) {
      yield put({
        type: 'saveCurrentUser',
        // payload: response,
      });
    },
  },

  reducers: {
    saveRoleList(state) {
      return { ...state };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
