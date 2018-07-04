import { updatePwd } from '../services/api';
import { setAuthority, getAuthority } from '../utils/authority';
import { handleSuccess } from '../utils/Handle';

export default {
  namespace: 'password',

  state: {
    changePwdObj: {},
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
        const { password } = payload;
        setAuthority('admin_user', { ...adminUser, password }); // 存储用户信息
        yield fork(handleSuccess, { content: '密码修改成功', pathname: '/userLayout/login' });
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
  },
};
