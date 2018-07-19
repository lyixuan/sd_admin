import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  userList,
  updateUserOrg,
  updateUserInfo,
  userDelete,
  wechatList,
  userAdd,
  listOrg,
} from '../services/api';

export default {
  namespace: 'user',

  state: {
    // 接口返回数据存储
    userList: [],
    wechatList: [],
    listOrg: [],
  },

  effects: {
    *userList({ payload }, { call, put }) {
      const response = yield call(userList, payload.userListParams);
      // console.log(response);
      yield put({ type: 'userListSave', payload: { response } });
    },
    *updateUserOrg({ payload }, { call, put }) {
      const result = yield call(updateUserOrg, payload.updateUserOrgParams);
      if (result.code === 2000) {
        message.success('更新成功！');
      } else {
        message.error(result.msg);
      }
      const response = yield call(userList, { size: 30, number: 0 });
      yield put({ type: 'userListSave', payload: { response } });
    },
    *updateUserInfo({ payload }, { call, put }) {
      const result = yield call(updateUserInfo, payload.updateUserInfoParams);
      if (result.code === 2000) {
        message.success('用户编辑成功！');
        yield put(routerRedux.goBack());
      } else {
        message.error(result.msg);
      }
    },
    *userDelete({ payload }, { call, put }) {
      const result = yield call(userDelete, payload.userDeleteParams);
      if (result.code === 2000) {
        message.success('用户删除成功！');
      } else {
        message.error(result.msg);
      }
      const response = yield call(userList, { size: 30, number: 0 });
      yield put({ type: 'userListSave', payload: { response } });
    },
    *userAdd({ payload }, { call, put }) {
      const result = yield call(userAdd, payload.userAddParams);
      if (result.code === 2000) {
        message.success('用户创建成功！');
        yield put(routerRedux.push('/config/userList'));
      } else {
        message.error(result.msg);
      }
    },
    *wechatList({ payload }, { call, put }) {
      const response = yield call(wechatList, payload.wechatListParams);
      yield put({ type: 'wechatListSave', payload: { response } });
    },
    *listOrg({ payload }, { call, put }) {
      const response = yield call(listOrg, payload.listOrgParams);
      yield put({ type: 'listOrgSave', payload: { response } });
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
    listOrgSave(state, action) {
      return {
        ...state,
        listOrg: action.payload,
      };
    },
  },
};
