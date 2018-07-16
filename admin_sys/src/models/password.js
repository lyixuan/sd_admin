import { updatePwd, findBackPwd, resetPwd } from '../services/api';
import { setAuthority, getAuthority, removeStorge } from '../utils/authority';
import { handleSuccess } from '../utils/Handle';

export default {
  namespace: 'password',

  state: {
    changePwdObj: {},
    findBackPwdObj: {},
    resertPwdObj: {},
  },

  effects: {
    *updatePwd({ payload }, { call, put, fork }) {
      const adminUser = getAuthority('admin_user') || {};
      const id = adminUser.userId || '';
      const response = yield call(updatePwd, { ...payload, id });
      yield put({
        type: 'saveNewPassword',
        payload: response,
      });
      if (response.code === 2000) {
        removeStorge('admin_user');
        // const { password } = payload;
        // setAuthority('admin_user', { ...adminUser, password }); // 存储用户信息
        yield fork(handleSuccess, { content: '密码修改成功', pathname: '/userLayout/login' });
      }
    },
    *findBackPwd({ payload }, { call, put }) {
      const { mail } = payload;
      const response = yield call(findBackPwd, { ...payload });
      yield put({
        type: 'saveFindBackPwd',
        payload: { response, mail },
      });
    },
    *resetPwd({ payload }, { call, put, fork }) {
      const { password } = payload;
      const response = yield call(resetPwd, { ...payload });
      yield put({
        type: 'saveResetPwd',
        payload: response,
      });
      if (response.code === 2000) {
        const adminUser = getAuthority('admin_user') || {};
        setAuthority('admin_user', { ...adminUser, password }); // 存储用户信息
        yield fork(handleSuccess, { content: '密码重置成功', pathname: '/userLayout/login' });
      }
    },
  },
  reducers: {
    saveNewPassword(state, { payload }) {
      const changePwdObj = {
        status: payload.code === 2000,
        msg: payload.msg,
      };
      return { ...state, changePwdObj };
    },
    saveFindBackPwd(state, { payload }) {
      const { response = {}, mail } = payload;
      const findBackPwdObj = {
        status: response.code === 2000,
        msg: response.msg,
        mail,
      };
      console.log(findBackPwdObj);
      return { ...state, findBackPwdObj };
    },
    saveResetPwd(state, { payload }) {
      const resertPwdObj = {
        status: payload.code === 2000,
        msg: payload.msg,
      };
      return { ...state, resertPwdObj };
    },
  },
};
