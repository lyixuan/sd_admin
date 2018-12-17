import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { userLogin, userLogout, CurrentUserListRole } from '@/services/api';
import { setAuthority, setAuthoritySeccion, removeStorge } from 'utils/authority';
import { handleSuccess } from 'utils/Handle';
import { ADMIN_USER, ADMIN_AUTH_LIST } from '@/utils/constants';

message.config({
  maxCount: 1,
});
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
    roleList: [],
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
          setAuthority(ADMIN_USER, { mail, password, userId, userName, token }); // 存储用户信息
        } else {
          setAuthoritySeccion(ADMIN_USER, { mail, password, userId, userName, token });
        }
        setAuthority(ADMIN_AUTH_LIST, privilegeList);
        // setAuthority('admin_token', { userId, token }); // 存储api token
        // reloadAuthorized();
        yield put(routerRedux.push('/'));
      } else {
        message.error(response.msg);
      }
    },
    *CurrentUserListRole(_, { call, put }) {
      const response = yield call(CurrentUserListRole, { userId: 1 });
      console.log(put, response);
    },
    *changeRole({ payload }, { call, put }) {
      yield put({
        type: 'changeLoginStatus',
      });
      console.log(payload, call, put);
    },
    *logout(_, { call }) {
      try {
        yield call(userLogout);
      } finally {
        removeStorge(ADMIN_USER);
        yield call(handleSuccess, {
          content: '退出登录',
          pathname: '/userLayout/login',
          time: 0.5,
        });
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
