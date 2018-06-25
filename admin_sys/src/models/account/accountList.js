import {
  queryAccountList,
  addAccount,
  updateAccount,
  deleteAccount,
  getRoleInfo,
  getRoleAdd,
} from '../../services/api';

export default {
  namespace: 'account',

  state: {
    list: [],
  },

  effects: {
    *accountList({ payload }, { call, put }) {
      const response1 = yield call(queryAccountList, payload.params);
      const response2 = yield call(getRoleInfo, payload.params2);
      yield put({ type: 'accountListSave', payload: { response1, response2 } });
    },
    *addAccount({ payload }, { call, put }) {
      const response = yield call(addAccount, payload.params);
      yield put({
        type: 'addAccountSave',
        payload: response,
      });
    },
    *updateAccount({ payload }, { call, put }) {
      const response = yield call(updateAccount, payload.params);
      yield put({
        type: 'updateAccountSave',
        payload: response,
      });
    },
    *deleteAccount({ payload }, { call, put }) {
      const response = yield call(deleteAccount, payload.params);
      yield put({
        type: 'deleteAccountSave',
        payload: response,
      });
    },
    *roleList({ payload }, { call, put }) {
      const response = yield call(queryAccountList, payload.params);
      yield put({
        type: 'roleListSave',
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
    accountListSave(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    addAccountSave(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    updateAccountSave(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    deleteAccountSave(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    roleListSave(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
