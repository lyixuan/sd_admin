import { message } from 'antd';
import { getBlComplainList, preDelBlComplainList, delBlComplainList } from '../services/api';

export default {
  namespace: 'blComplain',

  state: {},

  effects: {
    *getList({ payload }, { call, put }) {
      const { accountListParams } = payload;
      const response = yield call(getBlComplainList, { ...accountListParams });
      console.log(response);
      yield put({ type: 'save', payload: { response } });
    },
    *perDelComplain({ payload }, { call }) {
      const result = yield call(preDelBlComplainList, payload.updateAccountParams);
      if (result.code === 0 || result.code === 2000) {
        message.success('账号编辑成功！');
      } else {
        message.error(result.msg);
      }
    },
    *delComplain({ payload }, { call }) {
      console.log(payload.deleteAccountParams);
      const result = yield call(delBlComplainList, payload.deleteAccountParams);
      if (result.code === 0 || result.code === 2000) {
        message.success('账号删除成功！');
      } else {
        message.error(result.msg);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
