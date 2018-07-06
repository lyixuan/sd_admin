import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  queryAccountList,
  addAccount,
  updateAccount,
  deleteAccount,
  getRoleList,
  queryAccountInfo,
} from '../../services/api';

export default {
  namespace: 'blComplain',

  state: {
    // 请求接口上送参数
    accountListParams: { size: 30, number: 0 },
    addAccountParams: {},
    updateAccountParams: {},
    deleteAccountParams: {},
    getRoleListParams: {},
    accountInfoParams: {},
    // 接口返回数据存储
    accountList: [],
    getRoleList: [],
    accountInfo: [],
  },

  effects: {
    *accountList({ payload }, { call, put }) {
      const { accountListParams } = payload;
      const response = yield call(queryAccountList, { ...accountListParams });
      console.log(response);
      yield put({ type: 'accountListSave', payload: { response } });
    },
    *accountInfo({ payload }, { call, put }) {
      console.log('进入info的接口');
      const { accountInfoParams } = payload;
      const response = yield call(queryAccountInfo, { ...accountInfoParams });
      console.log(response);
      yield put({ type: 'accountInfoSave', payload: { response } });
    },
    *addAccount({ payload }, { call, put }) {
      const result = yield call(addAccount, payload.addAccountParams);
      if (result.code === 0 || result.code === 2000) {
        message.success('账号添加成功！');
        yield put(routerRedux.push('/account/accountList'));
      } else {
        message.error(result.msg);
      }
    },
    *updateAccount({ payload }, { call, put }) {
      const result = yield call(updateAccount, payload.updateAccountParams);
      if (result.code === 0 || result.code === 2000) {
        message.success('账号编辑成功！');
        yield put(routerRedux.push('/account/accountList'));
      } else {
        message.error(result.msg);
      }
    },
    *deleteAccount({ payload }, { call, put }) {
      console.log(payload.deleteAccountParams);
      const result = yield call(deleteAccount, payload.deleteAccountParams);
      if (result.code === 0 || result.code === 2000) {
        message.success('账号删除成功！');
      } else {
        message.error(result.msg);
      }
      const response = yield call(queryAccountList, { size: 30, number: 0 });
      console.log(response);
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
    accountInfoSave(state, action) {
      return {
        ...state,
        accountInfo: action.payload,
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