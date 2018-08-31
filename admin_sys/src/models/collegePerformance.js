import { message } from 'antd';
import { getCollegePerformanceList, getPersonalPerformanceList } from '../services/api';

export default {
  namespace: 'performance',

  state: {
    isLoading: null,
  },

  effects: {
    *getCollegeList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getCollegePerformanceList, { ...getListParams });
      if (response.code === 2000) {
        yield put({ type: 'saveVal', payload: { response, getListParams } });
      } else {
        message.error(response.msg);
      }
    },
    *getPersonalList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getPersonalPerformanceList, { ...getListParams });

      if (response.code === 2000) {
        yield put({ type: 'saveVal', payload: { response, getListParams } });
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    saveVal(state, action) {
      return {
        ...state,
        dataList: action.payload,
      };
    },
  },
};
