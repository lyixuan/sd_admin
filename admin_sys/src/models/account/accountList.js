
import { queryAccountList, addAccount, updateAccount, deleteAccount } from '../../services/api';


export default {
  namespace: 'account',

  state: {
    accountList: [],
    addAccount: [],
    updateAccount: [],
    deleteAccount: [],
    paramsObj1: {},
    paramsObj2: {},
  },

  effects: {
    *accountList({ payload }, { call, put }) {
      const response1 = yield call(queryAccountList, payload.params);
      const response = response1.data;
      yield put({ type: 'accountListSave', payload: { response } });
    },
    *addAccount({ payload }, { call, put }) {
      const response1 = yield call(addAccount, payload.params);
      const response = response1.data;
      yield put({
        type: 'addAccountSave',
        payload: response,
      });
    },
    *updateAccount({ payload }, { call, put }) {
      const response1 = yield call(updateAccount, payload.params);
      const response = response1.data;
      yield put({
        type: 'updateAccountSave',
        payload: response,
      });
    },
    *deleteAccount({ payload }, { call, put }) {
      const response1 = yield call(deleteAccount, payload.params);
      const response = response1.data;
      yield put({
        type: 'deleteAccountSave',
        payload: response,
      });
    },

  },

  reducers: {
    accountListSave(state, action) {
      return {
        ...state,
        accountList: action.payload,
      };
    },
    addAccountSave(state, action) {
      return {
        ...state,
        addAccount: action.payload,
      };
    },
    updateAccountSave(state, action) {
      return {
        ...state,
        updateAccount: action.payload,
      };
    },
    deleteAccountSave(state, action) {
      return {
        ...state,
        deleteAccount: action.payload,
      };
    },
  },
};
