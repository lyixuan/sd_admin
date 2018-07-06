
import {
  complaintDoublesList,
  upateComplaintDoubles,
} from '../services/api';

export default {
  namespace: 'complaintDoubles',

  state: {
    // 接口返回数据存储
    complaintDoublesList: [],
    upateComplaintDoubles:[],
  },

  effects: {
    *complaintDoublesList({ payload }, { call, put }) {
      console.log("进入model")
      const response = yield call(complaintDoublesList, payload.complaintDoublesListParams);
      console.log(response);
      yield put({ type: 'complaintDoublesListSave', payload: { response } });
    },
    *upateComplaintDoubles({ payload }, { call, put }) {
      const response = yield call(upateComplaintDoubles, payload.upateComplaintDoublesParams);
      // console.log(response);
      yield put({ type: 'upateComplaintDoublesSave', payload: { response } });
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
