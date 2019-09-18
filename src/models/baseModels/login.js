import { DEBUGGER_USER } from 'utils/constants';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { Base64 } from 'js-base64';
import storage from 'utils/storage';
import { casLogout, casLogoutDev } from 'utils/routeUtils';

import {
  userLogin,
  CurrentUserListRole,
  userChangeRole,
  getPrivilegeList,
  getPrivilegeListNew,
  getUserInfoNew,
} from '@/services/api';
import { setAuthority, setAuthoritySeccion, getUserInfo, isRepeatLogin } from 'utils/authority';
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
    loginState: false,
  },

  effects: {
    *initSubSystem({ payload }, { call, put }) {
      const response = yield call(getUserInfoNew, { ...payload });
      const codeMsg403 = 10300;
      if (!response) return;
      const data2 = response.data || {};
      const { userName, userId, mail, positionCount, token, userType } = data2;
      const saveObj = { userName, userId, mail, positionCount, token, userType };

      switch (response.code) {
        case 2000:
          storage.setItem('admin_user', saveObj);
          yield put({ type: 'getProvilege', payload: { params: {} } });
          break;
        case codeMsg403:
          yield put(routerRedux.push('/exception/403'));
          break;
        default:
          message.error(response.msg);
          break;
      }
    },
    *getProvilege(_, { call, put }) {
      const response = yield call(getPrivilegeListNew);
      if (!response) return;
      if (response.code === 2000) {
        const data = response.data || null;
        storage.setItem('admin_auth', data);
        yield put(routerRedux.push('/'));
      } else {
        message.error(response.msg);
      }
    },
    *reLogin(_, { call, put }) {
      //  用于和督导模块信息互通
      const userInfo = getUserInfo();
      let loginState = false;
      if (userInfo) {
        if (isRepeatLogin()) {
          const response = yield call(getPrivilegeList);
          if (response.code === 20000) {
            const data = response.data || {};
            const { privilegeList, ...others } = data;
            const { token, userId, ...reOthers } = userInfo;
            const saveObj = { token, userId, ...reOthers, ...others };
            setAuthority(ADMIN_USER, saveObj);
            setAuthority(ADMIN_AUTH_LIST, privilegeList);
            loginState = true;
          } else {
            loginState = false;
            message.error(response.msg);
          }
        } else {
          loginState = true;
        }
      } else {
        yield put(routerRedux.push('/userLayout/login'));
      }
      yield put({
        type: 'menu/getMenu',
      });
      yield put({
        type: 'logininState',
        payload: { loginState },
      });
    },
    *login({ payload }, { call, put }) {
      const { mail, password, autoLogin, redirectUrl } = payload;
      const response = yield call(userLogin, { mail, password });
      const saveObj = handleLogin({ mail, password, autoLogin }, response);
      if (saveObj.code === 2000) {
        if (redirectUrl && typeof redirectUrl === 'string') {
          const redirectParams = JSON.parse(Base64.decode(redirectUrl));
          const { data: { userId, token, positionCount } } = saveObj;
          const { type, env } = redirectParams;
          let { url } = redirectParams;
          if (type === 'inspector') {
            // 在localhost即开发环境下使用跳转,将参数通过url传递
            if (env === 'localhost') {
              const userInfo = Base64.encode(JSON.stringify({ userId, token, positionCount })); // 正常情况下应当传递userId,和token
              url = `${url}?paramsId=${userInfo}`;
            }
            window.location.href = url;
          } else if (type === 'robot') {
            const userInfo = Base64.encode(JSON.stringify({ userId, token })); // 正常情况下应当传递userId,和token
            url = `${url}?paramsId=${userInfo}`;
            window.location.href = url;
          }
        } else {
          yield put(routerRedux.push('/'));
        }
        yield put({
          type: 'changeLoginStatus',
          payload: saveObj,
        });
      } else {
        message.error(response.msg);
      }
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
      const userInfo = getUserInfo();
      if (response.code === 2000) {
        const data = response.data || {};
        const { privilegeList, ...resothers } = data;
        const { token, userId, ...others } = userInfo;
        const saveObj = { token, userId, ...others, ...resothers };
        setAuthority(ADMIN_USER, saveObj);
        setAuthority(ADMIN_AUTH_LIST, privilegeList);

        yield put({
          type: 'menu/getMenu',
          payload: { routeData: response.privilegeList },
        });
        yield put(routerRedux.push('/'));
      } else {
        message.error(response.msg);
      }
    },
    *logout(_, { call }) {
      if (0) yield call(userChangeRole);
      if (DEBUGGER_USER) {
        casLogoutDev();
      } else {
        casLogout();
      }
    },
  },

  reducers: {
    logininState(state, { payload }) {
      return { ...state, ...payload };
    },
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
