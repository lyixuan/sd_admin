import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { userLogin, userLogout, CurrentUserListRole, userChangeRole } from '@/services/api';
import { setAuthority, setAuthoritySeccion, removeStorge, getAuthority } from 'utils/authority';
import { handleSuccess } from 'utils/Handle';
import { ADMIN_USER, ADMIN_AUTH_LIST } from '@/utils/constants';

message.config({
  maxCount: 1,
});

const handleLogin = (payload, response) => {
  let saveObj = response || {};
  const { privilegeList = [], ...others } = response.data || {};
  const AuthList = Array.isArray(privilegeList) ? privilegeList : [];
  saveObj.privilegeList = AuthList;
  if (response.code === 2000 && AuthList.length === 0) {
    // 登录成功但无权限信息
    saveObj = Object.assign({}, saveObj, { code: 4001, msg: '登陆信息有误' });
  }
  if (response.code === 2000 && AuthList.length > 0) {
    const eventName = payload.autoLogin ? setAuthority : setAuthoritySeccion;
    eventName(ADMIN_USER, { ...payload, ...others });
    setAuthority(ADMIN_AUTH_LIST, privilegeList);
  }
  return saveObj;
};
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
      const { mail, password, autoLogin } = payload;
      const response = yield call(userLogin, { mail, password });
      const saveObj = handleLogin({ mail, password, autoLogin }, response);
      if (saveObj.code === 2000 && saveObj.privilegeList.length > 0) {
        yield put(routerRedux.push('/'));
      }
      yield put({
        type: 'changeLoginStatus',
        payload: saveObj,
      });
    },
    *CurrentUserListRole({ payload }, { call, put }) {
      const response = yield call(CurrentUserListRole, { ...payload });
      if (response.code === 2000) {
        yield put({
          type: 'saveRoleList',
          payload: { roleList: Array.isArray(response.data) ? response.data : [] },
        });
      } else {
        message.error(response.msg);
      }
    },
    *changeRole({ payload }, { call, put }) {
      const response = yield call(userChangeRole, { ...payload });
      const { mail, password } = getAuthority(ADMIN_USER);
      const saveObj = handleLogin({ mail, password, autoLogin: true }, response);
      if (saveObj.code === 2000 && saveObj.privilegeList.length > 0) {
        yield put({
          type: 'menu/getMenu',
          payload: { routeData: saveObj.privilegeList },
        });
        yield put(routerRedux.push('/'));
      } else {
        message.error(saveObj.msg);
      }
      yield put({
        type: 'changeLoginStatus',
        payload: saveObj,
      });
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
    saveRoleList(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
