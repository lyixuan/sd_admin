import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { userLogin, userLogout, queryCurrentUser, getUserAuth } from '../services/api';
import { setAuthority, setAuthoritySeccion, removeStorge, getAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { handleSuccess } from '../utils/Handle';

export default {
  namespace: 'login',

  state: {
    status: null,
    msg: '',
    loginStatusObj: {
      msg: '',
      status: false,
    },
    currentUser: {},
    authList: [],
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { mail, password } = payload;
      const response = yield call(userLogin, { mail, password });
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 2000) {
        const { userId, token } = response.data;
        if (payload.autoLogin === true) {
          setAuthority('admin_user', { mail, password, userId }); // 存储用户信息
        } else {
          setAuthoritySeccion('admin_user', { mail, password, userId });
        }
        setAuthority('admin_token', { userId, token }); // 存储api token
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *fetchCurrent({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(queryCurrentUser, { id });
      if (response.code === 2000) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } else {
        message.error('获取账号信息失败,请刷新页面');
      }
    },
    *logout(_, { call }) {
      try {
        yield call(userLogout);
      } finally {
        removeStorge('admin_user');
        yield call(handleSuccess, { content: '退出登录', pathname: '/userLayout/login' });
      }
    },
    *getAuthList(_, { call, put }) {
      const admin = getAuthority('admin_user') || {};
      const response = yield call(getUserAuth, { accountId: admin.userId });
      removeStorge('admin_auth');
      if (response.code === 2000) {
        setAuthority('admin_auth', response.data);
        yield put({
          type: 'saveAuthList',
          payload: response.data,
        });
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const loginStatusObj = {
        status: payload.code === 2000,
        msg: payload.msg,
      };
      return {
        ...state,
        loginStatusObj,
      };
    },
    saveCurrentUser(state, { payload }) {
      const currentUser = payload.data;
      return { ...state, currentUser };
    },
    saveAuthList(state, { payload }) {
      const authList = payload || [];
      return { ...state, authList };
    },
  },
};
