import { message } from 'antd';
import {
  recommendList,
  importCheck,
  importUpload,
  deleteCheck,
  deleteReview,
  findAllOrg,
} from '../services/api';

export default {
  namespace: 'goodStudent',

  state: {
    nums: '',
    current: 0,
    disableDel: null, // 根据接口返回决定是否禁止下一步按钮：true--禁止
    qualityList: [],
    fileList: [],
    findAllOrg: [], // 所有学院列表
    isLoading: null,
  },

  effects: {
    // 所有学院列表
    *findAllOrg(_, { call, put }) {
      const response = yield call(findAllOrg);
      if (response.code !== 2000) {
        message.error(response.msg);
      } else {
        yield put({
          type: 'save',
          payload: { findAllOrg: response.data },
        });
      }
    },
    *recommendList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(recommendList, { ...getListParams });
      yield put({ type: 'pureSave', payload: { response, getListParams } });
    },
    *importCheck({ payload }, { call, put }) {
      const logMsg = [];
      const checkList = yield call(importCheck, { ...payload });
      if (checkList.code !== 2000) {
        if (checkList.data.failList) {
          checkList.data.failList.forEach(item => {
            logMsg.push(item.log);
          });
          message.error(logMsg.join(','));
        } else {
          message.error(checkList.msg);
        }
        yield put({ type: 'save', payload: { current: 0, isLoading: false } });
      } else if (checkList.data.failList.length > 0) {
        yield put({
          type: 'save',
          payload: { checkList, current: 1, disableDel: true, isLoading: false },
        });
      } else {
        yield put({
          type: 'save',
          payload: { checkList, current: 1, disableDel: false, isLoading: false },
        });
      }
    },
    *importUpload({ payload }, { call, put }) {
      const excelData = yield call(importUpload, { ...payload });
      if (excelData.code !== 2000) {
        message.error(excelData.msg);
        yield put({ type: 'save', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'save', payload: { current: 2, isLoading: false } });
      }
    },
    *deleteCheck({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(deleteCheck, { ...params });

      if (preDelData.code !== 2000) {
        message.error(preDelData.msg);
        yield put({ type: 'save', payload: { current: 0, isLoading: false } });
      } else if (preDelData.data.successCount > 0) {
        yield put({
          type: 'save',
          payload: { preDelData, current: 1, disableDel: false, isLoading: false },
        });
      } else {
        yield put({
          type: 'save',
          payload: { preDelData, current: 1, disableDel: true, isLoading: false },
        });
      }
    },
    *deleteReview({ payload }, { call, put }) {
      const { params } = payload;
      const delData = yield call(deleteReview, { ...params });
      if (delData.code !== 2000) {
        message.error(delData.msg);
        yield put({ type: 'save', payload: { current: 2, isLoading: false } });
      } else {
        yield put({ type: 'save', payload: { delData, current: 3, isLoading: false } });
      }
    },
    *getNums({ payload }, { put }) {
      const { nums } = payload;
      yield put({ type: 'save', payload: { nums } });
    },
    *saveFileList({ payload }, { put }) {
      const { fileList } = payload;
      yield put({ type: 'save', payload: { fileList } });
    },
    *editCurrent({ payload }, { put }) {
      const { current } = payload;
      yield put({ type: 'save', payload: { current, isLoading: false } });
    },
    *editLoading({ payload }, { put }) {
      const { isLoading } = payload;
      yield put({ type: 'save', payload: { isLoading } });
    },
    *initParams({ payload }, { put }) {
      const { disableDel, nums } = payload;
      yield put({ type: 'save', payload: { disableDel, nums } });
    },
  },

  reducers: {
    save(state, action) {
      const { checkList } = action.payload;
      if (checkList) {
        const { failList } = checkList.data;
        if (failList) {
          failList.forEach((item, i) => {
            failList[i].key = i;
          });
        }
      }
      return { ...state, ...action.payload };
    },
    pureSave(state, action) {
      return {
        ...state,
        qualityList: action.payload,
      };
    },
  },
};
