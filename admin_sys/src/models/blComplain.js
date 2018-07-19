import { message } from 'antd';
import {
  getBlComplainList,
  preDelBlComplainList,
  delBlComplainList,
  checkComplainList,
  saveDataComplain,
} from '../services/api';

export default {
  namespace: 'blComplain',

  state: {
    getListParams: { size: 30, number: 0 },
    getList: [],
    fileList: [],
    nums: '',
    current: 0,
    disableDel: null,
    isLoading: null,
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getBlComplainList, { ...getListParams });
      yield put({ type: 'save', payload: { response, getListParams } });
    },
    *checkComplain({ payload }, { call, put }) {
      const { params } = payload;
      const checkList = yield call(checkComplainList, { ...params });

      if (checkList.code !== 2000) {
        message.error(checkList.msg);
        yield put({ type: 'savePreData', payload: { current: 0, isLoading: false } });
      } else if (checkList.data.errorList.length > 0) {
        yield put({
          type: 'savePreData',
          payload: { checkList, current: 1, disableDel: true, isLoading: false },
        });
      } else {
        yield put({
          type: 'savePreData',
          payload: { checkList, current: 1, disableDel: false, isLoading: false },
        });
      }
    },
    *saveExcel({ payload }, { call, put }) {
      const { params } = payload;
      const excelData = yield call(saveDataComplain, { ...params });
      if (excelData.code !== 2000) {
        message.error(excelData.msg);
        yield put({ type: 'savePreData', payload: { current: 2, isLoading: false } });
      } else {
        yield put({ type: 'savePreData', payload: { excelData, current: 3, isLoading: false } });
      }
    },
    *preDelComplain({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(preDelBlComplainList, { ...params });
      if (preDelData.code !== 2000) {
        message.error(preDelData.msg);
        yield put({ type: 'savePreData', payload: { current: 0, isLoading: false } });
      } else if (preDelData.data.successSize > 0) {
        yield put({
          type: 'savePreData',
          payload: { preDelData, current: 1, disableDel: false, isLoading: false },
        });
      } else {
        yield put({
          type: 'savePreData',
          payload: { preDelData, current: 1, disableDel: true, isLoading: false },
        });
      }
    },
    *delComplain({ payload }, { call, put }) {
      const { params } = payload;
      const delData = yield call(delBlComplainList, { ...params });
      if (delData.code !== 2000) {
        message.error(delData.msg);
        yield put({ type: 'savePreData', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'savePreData', payload: { delData, current: 2, isLoading: false } });
      }
    },
    *getNums({ payload }, { put }) {
      const { nums } = payload;
      yield put({ type: 'savePreData', payload: { nums } });
    },
    *saveFileList({ payload }, { put }) {
      const { fileList } = payload;
      yield put({ type: 'savePreData', payload: { fileList } });
    },
    *editCurrent({ payload }, { put }) {
      const { current } = payload;
      yield put({ type: 'savePreData', payload: { current, isLoading: false } });
    },
    *editLoading({ payload }, { put }) {
      const { isLoading } = payload;
      yield put({ type: 'savePreData', payload: { isLoading } });
    },
    *initParams({ payload }, { put }) {
      const { disableDel, nums } = payload;
      yield put({ type: 'savePreData', payload: { disableDel, nums } });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        getList: action.payload,
      };
    },
    savePreData(state, action) {
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
