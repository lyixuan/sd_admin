import { message } from 'antd';
import { packageList, packageInfo, addPackage } from '../services/api';

export default {
  namespace: 'coefficient',
  state: {},

  effects: {
    *packageList({ payload }, { call, put }) {
      const response = yield call(packageList, payload.userListParams);
      if (response.code === 2000) {
        const { data = {} } = response;
        yield put({ type: 'packageListSave', payload: { data } });
      } else {
        message.error(response.msg);
      }
    },
    *packageInfo({ payload }, { call, put }) {
      const response = yield call(packageInfo, payload.userListParams);
      console.log('model中的数据', response);
      if (response.code === 2000) {
        const { data = {} } = response;
        yield put({ type: 'packageInfoSave', payload: { data } });
      } else {
        message.error(response.msg);
      }
    },
    *addPackage({ payload }, { call }) {
      // 创建绩效包
      const response = yield call(addPackage, payload);
      console.log(response);
      if (response.code === 2000) {
        message.success('更新成功！');
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    packageListSave(state, action) {
      return { ...state, ...action.payload };
    },
    packageInfoSave(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
