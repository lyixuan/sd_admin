
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
    upateComplaintDoubles: [],
  },

  effects: {
    *complaintDoublesList({ payload }, { call, put }) {

      const response = yield call(complaintDoublesList, payload.complaintDoublesListParams);
      console.log(response);
      yield put({ type: 'complaintDoublesListSave', payload: { response } });
    },
    *upateComplaintDoubles({ payload }, { call, put }) {
      const response = yield call(upateComplaintDoubles, payload.upateComplaintDoublesParams);
      if (response.code === 2000) {
        message.success('投诉倍数修改成功！');
        // const response1 = yield call(complaintDoublesList, payload.complaintDoublesListParams);
        // console.log(response1);
        // yield put({ type: 'complaintDoublesListSave', payload: { response1 } });
      } else {
        message.error(response.msg);
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
    upateComplaintDoublesSave(state, action) {
      return {
        ...state,
        upateComplaintDoubles: action.payload,
      };
    },
  },
};
