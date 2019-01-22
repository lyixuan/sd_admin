import { message } from 'antd';
import {
  creditAdjustGetList,
  creditAdjustDelById,
  creditAdjustGetDetail,
  creditAdjustSaveOrModify,
  organizationList,
} from '../services/api';

export default {
  namespace: 'scoreAdjust',

  state: {
    list: {},
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(creditAdjustGetList, payload.obj);
      const listData = response && response.data ? { ...response.data } : {};

      if (response.code === 2000) {
        yield put({ type: 'listSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    *delById({ payload }, { call, put }) {
      const response = yield call(creditAdjustDelById, payload.obj);
      const listData = response && response.data ? { ...response.data } : {};

      if (response.code === 2000) {
        yield put({ type: 'auditListSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    *getDetail({ payload }, { call, put }) {
      const response = yield call(creditAdjustGetDetail, payload.obj);
      const listData = response && response.data ? { ...response.data } : {};

      if (response.code === 2000) {
        yield put({ type: 'auditListSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    *saveDetail({ payload }, { call, put }) {
      const response = yield call(creditAdjustSaveOrModify, payload.obj);
      const listData = response && response.data ? { ...response.data } : {};

      if (response.code === 2000) {
        yield put({ type: 'auditListSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    *organizationList({ payload }, { call, put }) {
      const response = yield call(organizationList, payload.obj);
      const listData = response && response.data ? { ...response.data } : {};

      if (response.code === 2000) {
        yield put({ type: 'auditListSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    listSave(state, action) {
      return {
        ...state,
        list: action.payload.listData,
      };
    },
  },
};
