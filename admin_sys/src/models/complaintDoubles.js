
// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  complaintDoublesList,
  upateComplaintDoubles,
} from '../services/api';

export default {
  namespace: 'complaintDoubles',

  state: {
    // 接口返回数据存储
    complaintDoublesList: [],
  },

  effects: {
    *complaintDoublesList({ payload }, { call, put }) {
      const response = yield call(complaintDoublesList, payload.complaintDoublesListParams);
      yield put({ type: 'complaintDoublesListSave', payload: { response } });
    },
    *upateComplaintDoubles({ payload }, { call, put }) {
      const result = yield call(upateComplaintDoubles, payload.upateComplaintDoublesParams);
      if (result.code === 2000) {
        message.success('投诉倍数修改成功！');
        const response = yield call(complaintDoublesList, payload.complaintDoublesListParams);
        console.log(response);
        yield put({ type: 'complaintDoublesListSave', payload: { response } });
      } else {
        message.error(result.msg);
      }
    },
  },

  reducers: {
    complaintDoublesListSave(state, action) {
      return {
        ...state,
        complaintDoublesList: action.payload,
      };
    },
  },
};
