import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  creditAdjustGetList,
  creditAdjustDelById,
  creditAdjustGetDetail,
  creditAdjustSaveOrModify,
  organizationList,
  findAllCollege,
} from '../services/api';

export default {
  namespace: 'scoreAdjust',

  state: {
    list: {},
    orgList: [],
    detail: {},
    college: [],
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
    *findAllCollege({ payload }, { call, put }) {
      const response = yield call(findAllCollege, payload.obj);
      const listData = response && response.data ? [...response.data] : [];

      if (response.code === 2000) {
        yield put({ type: 'collegeSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    *delById({ payload }, { call }) {
      const response = yield call(creditAdjustDelById, payload);

      if (response.code === 2000) {
        console.log('ok');
      } else {
        message.error(response.msg);
      }
    },
    *getDetailById({ payload }, { call, put }) {
      const response = yield call(creditAdjustGetDetail, payload);
      const listData = response && response.data ? { ...response.data } : {};

      if (response.code === 2000) {
        yield put({ type: 'detailSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    *saveDetail({ payload }, { call, put }) {
      const response = yield call(creditAdjustSaveOrModify, payload.params);
      if (response.code === 2000) {
        yield put(routerRedux.push('/appeal/scoreAdjustList'));
      } else {
        message.error(response.msg);
      }
    },
    *organizationList({ payload }, { call, put }) {
      const response = yield call(organizationList, payload);
      if (response && response.code === 2000) {
        const listData = response.data ? [...response.data] : [];
        yield put({ type: 'orgSave', payload: { listData } });
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
    orgSave(state, action) {
      return {
        ...state,
        orgList: action.payload.listData,
      };
    },
    collegeSave(state, action) {
      return {
        ...state,
        college: action.payload.listData,
      };
    },
    detailSave(state, action) {
      return {
        ...state,
        detail: action.payload.listData,
      };
    },
  },
};
