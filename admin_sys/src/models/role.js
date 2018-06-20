export default {
  namespace: 'role',

  state: {
    params: [],
    currentUser: {},
  },

  effects: {
    *roleList(_, { put }) {
      yield put({
        type: 'saveRoleList',
        // payload: response,
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
    saveRoleList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
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
