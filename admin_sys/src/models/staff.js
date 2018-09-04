// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getStaffList, getStaffDetail } from '../services/staff';

export default {
  namespace: 'staff',

  state: {
    // 接口返回数据存储
    data: {},
    staffDetail: null,
  },

  effects: {
    *staffList({ payload }, { call, put }) {
      const response = yield call(getStaffList, payload);
      // console.log(response);
      if (response.code === 2000) {
        const data = response.data || {};
        yield put({ type: 'staffListSave', payload: data });
      } else {
        message.error(response.msg);
      }
    },
    *getStaffDetail({ payload }, { call, put }) {
      const response = yield call(getStaffDetail, payload);
      if (response.code === 2000) {
        const data = response.data || {};
        yield put({ type: 'saveStaffDetail', payload: data });
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    saveStaffDetail(state, { payload }) {
      const staffDetail = payload;
      return {
        ...state,
        staffDetail,
      };
    },
    staffListSave(state, { payload }) {
      const data = payload;
      return {
        ...state,
        data,
      };
    },
  },
};
