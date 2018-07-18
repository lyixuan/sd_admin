import { message } from 'antd';
import {
  getBlRefundList,
  preDelBlRefundList,
  delBlRefundList,
  checkRefundList,
  saveDataRefund,
} from '../services/api';

export default {
  namespace: 'blRefund',

  state: {
    nums: '',
    disableDel: null,
    current: 0,
    fileList: [],
    isLoading: null,
  },

  effects: {
    *refundList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const listData = yield call(getBlRefundList, { ...getListParams });
      yield put({ type: 'save', payload: { listData, getListParams } });
    },
    *checkRefund({ payload }, { call, put }) {
      const { params } = payload;
      const checkList = yield call(checkRefundList, { ...params });
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
      console.log(params);
      const excelData = yield call(saveDataRefund, { ...params });
      if (excelData.code !== 2000) {
        message.error(excelData.msg);
        yield put({ type: 'save', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'save', payload: { excelData, current: 2, isLoading: false } });
      }
    },
    *preDelRefund({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(preDelBlRefundList, { ...params });
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
    *delRefund({ payload }, { call, put }) {
      const { params } = payload;
      const delData = yield call(delBlRefundList, { ...params });
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
