import { checkQuality } from '../services/api';

export default {
  namespace: 'refund',

  state: {},

  effects: {
    *refundList({ payload }, { call, put }) {
      const { data } = payload;
      const response = yield call(checkQuality, { ...data });
      console.log(response);
      yield put({ type: 'save', payload: { response } });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
