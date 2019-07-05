import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { Base64 } from 'js-base64';
import storage from 'utils/storage';
import {
  userLogin,
  userLogout,
  CurrentUserListRole,
  userChangeRole,
  getPrivilegeList,
  getPrivilegeListNew,
  getBaseUserInfo,
} from '@/services/api';
import {
  setAuthority,
  setAuthoritySeccion,
  removeStorge,
  getUserInfo,
  isRepeatLogin,
} from 'utils/authority';
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
    loginState: false,
  },

  effects: {
    *initSubSystem(_, { call }) {
      // 初始化系统，判断缓存信息是否存在，不存在从接口获取。
      const response = yield call(getPrivilegeListNew);
      if (response.code === 20000) {
        const data = response.data || {};
        const { privilegeList } = data;
        storage.setItem('admin_auth', privilegeList);
      } else {
        message.error(response.msg);
      }
      const response2 = yield call(getBaseUserInfo);
      if (response2.code === 20000) {
        const data = response2.data || {};
        const { token, userId, ...others } = data;
        const saveObj = { token, userId, ...others };
        storage.setItem('admin_user', saveObj);
      } else {
        message.error(response2.msg);
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
        // todo 1 进入域名首页，请求该接口（获取用户信息和权限信息），先从缓存获取，失败后从接口获取，再失败（非401）跳转到sso登录地址；如401，在request.js页面拦截跳转到sso登录地址
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
      try {
        yield call(userLogout);
      } finally {
        removeStorge(ADMIN_USER);
        // todo 修改登出接口地址；主动登出和401时调用，401登出，需传递重定向参数
        yield call(handleSuccess, {
          content: '退出登录',
          pathname: '/userLayout/login',
          time: 0.5,
        });
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
