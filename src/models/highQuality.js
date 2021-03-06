import { message } from 'antd';
import {
  UGCdeleteCheck,
  UGCdeleteReview,
  UGCdeleteRecommend,
  findAllOrg,
  highQualityList,
  UGCimportCheck,
  UGCimportSubmit,
} from '../services/api';

export default {
  namespace: 'highQuality',

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
    // *recommendList({ payload }, { call, put }) {
    //   const { getListParams } = payload;
    //   const response = yield call(recommendList, { ...getListParams });
    //   yield put({ type: 'pureSave', payload: { response, getListParams } });
    // },
    // 优质帖
    *highQualityList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(highQualityList, { ...getListParams });
      yield put({ type: 'pureSave', payload: { response, getListParams } });
    },
    *UGCimportCheck({ payload }, { call, put }) {
      const logMsg = [];
      const checkList = yield call(UGCimportCheck, { ...payload });
      if (checkList.code !== 20000) {
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
    *UGCimportSubmit({ payload }, { call, put }) {
      const excelData = yield call(UGCimportSubmit, { ...payload });
      if (excelData.code !== 20000) {
        message.error(excelData.msg);
        yield put({ type: 'save', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'save', payload: { current: 2, isLoading: false } });
      }
    },
    *UGCdeleteCheck({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(UGCdeleteCheck, { ...params });

      if (preDelData.code !== 20000) {
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
    *UGCdeleteReview({ payload }, { call, put }) {
      const delData = yield call(UGCdeleteReview, { ...payload });
      if (delData.code !== 20000) {
        message.error(delData.msg);
        yield put({ type: 'save', payload: { current: 1, isLoading: false } });
      } else {
        yield put({
          type: 'save',
          payload: { delData: delData.data, current: 2, isLoading: false },
        });
      }
    },
    *UGCdeleteRecommend({ payload }, { call, put }) {
      const delSucessData = yield call(UGCdeleteRecommend, { ...payload });
      if (delSucessData.code !== 20000) {
        message.error(delSucessData.msg);
        yield put({ type: 'save', payload: { current: 2, isLoading: false } });
      } else {
        yield put({
          type: 'save',
          payload: { delSucessData: delSucessData.data, current: 3, isLoading: false },
        });
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
