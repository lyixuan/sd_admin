import { queryAccountList, getRoleAdd } from '../../services/api';

export default {
  namespace: 'account',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAccountList, payload.params);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *addRoule({ payload }, { call, put }) {
      const response = yield call(getRoleAdd, payload.params);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
