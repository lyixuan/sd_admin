import { message} from 'antd';
import {
  queryAccountList,
  addAccount,
  updateAccount,
  deleteAccount,
  getRoleList,
} from '../../services/api';


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
    getRoleList: [],
  },

  effects: {
    *accountList({ payload }, { call, put }) {
      const response = yield call(queryAccountList, payload.accountListParams);
      console.log(response)
      yield put({ type: 'accountListSave', payload: { response } });
    },
    *addAccount({ payload }, { call, put }) {
      const result = yield call(addAccount, payload.addAccountParams);
      const response = yield call(queryAccountList, {});
      console.log(result,result.code)
      console.log(result.code === 0 || result.code === 2000)
      if(result.code === 0 || result.code === 2000){
        yield put({
          type: 'accountListSave',
          payload: { response },
        });
      }else{
        message.error(result.msg);
      }
    },
    *updateAccount({ payload }, { call, put }) {
      const result = yield call(updateAccount, payload.updateAccountParams);
      const response = yield call(queryAccountList, {});
      console.log(result)
      yield put({
        type: 'accountListSave',
        payload: { response, result },
      });
    },
    *deleteAccount({ payload }, { call, put }) {
      console.log(payload.deleteAccountParams);
      yield call(deleteAccount, payload.deleteAccountParams);
      const response = yield call(queryAccountList, {});
      console.log(response)
      yield put({
        type: 'accountListSave',
        payload: { response },
      });
    },
    *getRoleList({ payload }, { call, put }) {
      const response = yield call(getRoleList, payload.getRoleListParams);
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
    getRoleListSave(state, action) {
      return {
        ...state,
        getRoleList: action.payload,
      };
    },
  },
};
