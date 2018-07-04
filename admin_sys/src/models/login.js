import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { userLogin, queryCurrentUser } from '../services/api';
import { setAuthority, setAuthoritySeccion } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

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
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { mail, password } = payload;
      const response = yield call(userLogin, payload);
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
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const loginStatusObj = {
        status: payload.code === 2000,
        msg: payload.data,
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
  },
};
