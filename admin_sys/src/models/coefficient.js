import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { packageList, packageInfo, addPackage, updatePackage } from '../services/api';

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
      if (response.code === 2000) {
        const { data = {} } = response;
        yield put({ type: 'packageInfoSave', payload: { data } });
      } else {
        message.error(response.msg);
      }
    },
    *addPackage({ payload }, { call, put }) {
      // 创建绩效包
      const response = yield call(addPackage, payload);
      if (response.code === 2000) {
        message.success('更新成功！');
        if (payload.packageType === 3) {
          yield put(routerRedux.push('/performance/groupCoefficient/list'));
        } else if (payload.packageType === 2) {
          yield put(routerRedux.push('/performance/familyCoefficient/list'));
        } else {
          console.error('非家族小组绩效包类型');
        }
      } else if (response.msg === '档位值必须在区间[0, 999999]') {
        message.error('请完善所有信息');
      } else {
        message.error(response.msg);
      }
    },
    *updatePackage({ payload }, { call, put }) {
      // 更新绩效包
      const response = yield call(updatePackage, payload);
      if (response.code === 2000) {
        message.success('更新成功！');
        if (payload.packageType === 3) {
          yield put(routerRedux.push('/performance/groupCoefficient/list'));
        } else if (payload.packageType === 2) {
          yield put(routerRedux.push('/performance/familyCoefficient/list'));
        } else {
          console.error('非家族小组绩效包类型');
        }
      } else if (response.msg === '档位值必须在区间[0, 999999]') {
        message.error('请完善所有信息');
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
