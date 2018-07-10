import { checkQuality } from '../services/api';

export default {
  namespace: 'quality',

  state: {
    nums: '',
  },

  effects: {
    *checkQuality({ payload }, { call, put }) {
      const { data } = payload;
      const response = yield call(checkQuality, { ...data });
      console.log(response);
      yield put({ type: 'save', payload: { response } });
    },
    *getNums({ payload }, { put }) {
      const { nums } = payload;
      yield put({ type: 'save', payload: { nums } });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
