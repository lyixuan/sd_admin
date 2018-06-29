
import {
  userList,
  updateUserOrg,
  updateUserInfo,
  userDelete,
  userAdd, getRoleListAll, addPermission,
} from '../services/api';

export default {
  namespace: 'user',

  state: {
    // 接口返回数据存储
    userList: [],
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
  },

  reducers: {
    userListSave(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
  },
};
