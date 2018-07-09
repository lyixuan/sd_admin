// import { message } from 'antd';
import { updateGroup } from '../services/api';

export default {
  namespace: 'timemanage',

  state: {},

  effects: {
    *updateTimeArea({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const getCode = yield call(updateGroup, { ...paramsObj });
      yield put({
        type: 'saveTimeArea',
        payload: getCode,
      });
    },
  },

  reducers: {
    saveTimeArea(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
