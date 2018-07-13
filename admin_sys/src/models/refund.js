import { message } from 'antd';
import {
  getBlRefundList,
  preDelBlRefundList,
  delBlRefundList,
  checkRefundList,
} from '../services/api';

export default {
  namespace: 'blRefund',

  state: {
    nums: '',
    current: 0,
  },

  effects: {
    *refundList({ payload }, { call, put }) {
      const { params } = payload;
      const listData = yield call(getBlRefundList, { ...params });
      yield put({ type: 'save', payload: { listData } });
    },
    *checkRefund({ payload }, { call, put }) {
      const { params } = payload;
      const checkList = yield call(checkRefundList, { ...params });
      if (checkList.code !== 2000) {
        message.error(checkList.msg);
        yield put({ type: 'save', payload: { current: 0 } });
      } else {
        yield put({ type: 'save', payload: { checkList, current: 1 } });
      }
    },
    *preDelRefund({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(preDelBlRefundList, { ...params });
      if (preDelData.code !== 2000) {
        message.error(preDelData.msg);
        yield put({ type: 'save', payload: { current: 0 } });
      } else {
        yield put({ type: 'save', payload: { preDelData, current: 1 } });
      }
    },
    *delRefund({ payload }, { call, put }) {
      const { params } = payload;
      const delData = yield call(delBlRefundList, { ...params });
      if (delData.code !== 2000) {
        message.error(delData.msg);
        yield put({ type: 'save', payload: { current: 1 } });
      } else {
        yield put({ type: 'save', payload: { delData, current: 2 } });
      }
    },
    *getNums({ payload }, { put }) {
      const { nums } = payload;
      yield put({ type: 'save', payload: { nums } });
    },
    *editCurrent({ payload }, { put }) {
      const { current } = payload;
      yield put({ type: 'save', payload: { current } });
    },
  },

  reducers: {
    save(state, action) {
      const { checkList } = action.payload;
      if (checkList) {
        const { errorList } = checkList.data;
        if (errorList) {
          errorList.forEach((item, i) => {
            errorList[i].key = i;
          });
        }
      }
      return { ...state, ...action.payload };
    },
  },
};
