import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { userLogin, userLogout } from '../services/api';
import { setAuthority, setAuthoritySeccion, removeStorge } from '../utils/authority';
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
        const { userId, token, userName, privilegeList = [] } = response.data;
        if (payload.autoLogin === true) {
          setAuthority('admin_user', { mail, password, userId, userName, token }); // 存储用户信息
        } else {
          setAuthoritySeccion('admin_user', { mail, password, userId, userName, token });
        }
        setAuthority('admin_auth', privilegeList);
        // setAuthority('admin_token', { userId, token }); // 存储api token
        // reloadAuthorized();
        yield put(routerRedux.push('/'));
      } else {
        message.error(response.msg);
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
    // saveCurrentUser(state, { payload }) {
    //   const currentUser = payload.data;
    //   return { ...state, currentUser };
    // },
    saveAuthList(state, { payload }) {
      const authList = payload || [];
      return { ...state, authList };
    },
  },
};
