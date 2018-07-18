import { message } from 'antd';
import {
  getQualityList,
  checkQualityList,
  delQualityList,
  preDelQualityList,
  saveDataQuality,
} from '../services/api';

export default {
  namespace: 'quality',

  state: {
    nums: '',
    current: 0,
    disableDel: null, // 根据接口返回决定是否禁止下一步按钮：true--禁止
    qualityList: [],
    isLoading: null,
  },

  effects: {
    *getQualityList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getQualityList, { ...getListParams });
      yield put({ type: 'qualityListSave', payload: { response, getListParams } });
    },
    *checkQuality({ payload }, { call, put }) {
      const { params } = payload;
      const checkList = yield call(checkQualityList, { ...params });
      if (checkList.code !== 2000) {
        message.error(checkList.msg);
        yield put({ type: 'save', payload: { current: 0, isLoading: false } });
      } else if (checkList.data.errorList.length > 0) {
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
    *saveExcel({ payload }, { call, put }) {
      const { params } = payload;
      const excelData = yield call(saveDataQuality, { ...params });
      if (excelData.code !== 2000) {
        message.error(excelData.msg);
        yield put({ type: 'save', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'save', payload: { current: 2, isLoading: false } });
      }
    },
    *preDelQuality({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(preDelQualityList, { ...params });

      if (preDelData.code !== 2000) {
        message.error(preDelData.msg);
        yield put({ type: 'save', payload: { current: 0, isLoading: false } });
      } else if (preDelData.data.successSize > 0) {
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
    *delQuality({ payload }, { call, put }) {
      const { params } = payload;
      const delData = yield call(delQualityList, { ...params });
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
    *initParams({ payload }, { put }) {
      const { disableDel, nums } = payload;
      yield put({ type: 'save', payload: { disableDel, nums } });
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
    qualityListSave(state, action) {
      return {
        ...state,
        qualityList: action.payload,
      };
    },
  },
};
