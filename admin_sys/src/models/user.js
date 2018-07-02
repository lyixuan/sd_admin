
import {
  userList,
  updateUserOrg,
  updateUserInfo,
  userDelete,
  wechatList,
  userAdd,
} from '../services/api';

export default {
  namespace: 'user',

  state: {
    // 接口返回数据存储
    userList: [],
    wechatList: [],
  },

  effects: {
    *userList({ payload }, { call, put }) {
      const response = yield call(userList, payload.userListParams);
      console.log(response)
      yield put({ type: 'userListSave', payload: { response } });
    },
    *updateUserOrg({ payload }, { call, put }) {
      yield call(updateUserOrg, payload.updateUserOrgParams);
      const response = yield call(userList, payload.userListParams);
      console.log(response)
      yield put({ type: 'userListSave', payload: { response } });
    },
    *updateUserInfo({ payload }, { call, put }) {
      yield call(updateUserInfo, payload.updateUserInfoParams);
      const response = yield call(userList, {});
      console.log(response)
      yield put({ type: 'userListSave', payload: { response } });
    },
    *userDelete({ payload }, { call, put }) {
      yield call(userDelete, payload.userDeleteParams);
      const response = yield call(userList, {});
      console.log(response)
      yield put({ type: 'userListSave', payload: { response } });
    },
    *userAdd({ payload }, { call, put }) {
      yield call(userAdd, payload.userAddParams);
      const response = yield call(userList, {});
      console.log(response)
      yield put({ type: 'userListSave', payload: { response } });
    },
    *wechatList({ payload }, { call, put }) {
      const response = yield call(wechatList, payload.wechatListParams);
      console.log(response)
      yield put({ type: 'wechatListSave', payload: { response } });
    },
  },

  reducers: {
    userListSave(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
    wechatListSave(state, action) {
      return {
        ...state,
        wechatList: action.payload,
      };
    },
  },
};
