import { getBlComplainList } from '../services/api';

export default {
  namespace: 'quality',

  state: {
    nums: '',
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getBlComplainList, { ...getListParams });
      console.log(response);
      yield put({ type: 'save', payload: { response } });
    },
    *getNums({ payload }, { put }) {
      const { nums } = payload;
      yield put({ type: 'savePreData', payload: { nums } });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        getList: action.payload,
      };
    },
    savePreData(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
