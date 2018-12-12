export default {
  namespace: 'menu',

  state: {
    menuData: [],
  },

  effects: {
    *getMenu({ payload }, { put }) {
      yield put({
        type: 'saveMenu',
        payload,
      });
    },
  },

  reducers: {
    saveMenu(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
