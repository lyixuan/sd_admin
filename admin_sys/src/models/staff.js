// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getStaffList } from '../services/staff';

export default {
  namespace: 'staff',

  state: {
    // 接口返回数据存储
    staffList: [],
  },

  effects: {
    *staffList({ payload }, { call, put }) {
      const response = yield call(getStaffList, payload);
      // console.log(response);
      if (response.code === 2000) {
        const data = response.data || {};
        const staffList = data.content || [];
        yield put({ type: 'staffListSave', payload: { staffList } });
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    staffListSave(state, { payload }) {
      const { staffList = [] } = payload;
      return {
        ...state,
        staffList,
      };
    },
  },
};
