
import { queryAccountList, addAccount, updateAccount, deleteAccount,getRoleList } from '../../services/api';


export default {
  namespace: 'account',

  state: {
    // 请求接口上送参数
    accountListParams: {},
    addAccountParams: {},
    updateAccountParams: {},
    deleteAccountParams: {},
    getRoleListParams: {},

    // 接口返回数据存储
    accountList: [],
    addAccount: [],
    updateAccount: [],
    deleteAccount: [],
    getRoleList:[],
  },

  effects: {
    *accountList({ payload }, { call, put }) {
      const response1 = yield call(queryAccountList, payload.accountListParams);
      const response = response1.data;
      yield put({ type: 'accountListSave', payload: { response } });
    },
    *addAccount({ payload }, { call, put }) {
      const response1 = yield call(addAccount, payload.addAccountParams);
      const response = response1.data;
      yield put({
        type: 'addAccountSave',
        payload: response,
      });
    },
    *updateAccount({ payload }, { call, put }) {
      const response1 = yield call(updateAccount, payload.updateAccountParams);
      const response = response1.data;
      yield put({
        type: 'updateAccountSave',
        payload: response,
      });
    },
    *deleteAccount({ payload }, { call, put }) {
      console.log(payload.deleteAccountParams)
      const response1 = yield call(deleteAccount, payload.deleteAccountParams);
      const response = response1.data;
      yield put({
        type: 'deleteAccountSave',
        payload: response,
      });
    },
    *getRoleList({ payload }, { call, put }) {
      const response1 = yield call(getRoleList, payload.getRoleListParams);
      const response = response1.data;
      yield put({
        type: 'getRoleListSave',
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
    getRoleListSave(state, action) {
      return {
        ...state,
        getRoleList: action.payload,
      };
    },
  },
};
