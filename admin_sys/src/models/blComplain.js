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
    nums: '',
    current: 0,
    disableDel: null,
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getBlComplainList, { ...getListParams });
      yield put({ type: 'save', payload: { response } });
    },
    *checkComplain({ payload }, { call, put }) {
      const { params } = payload;
      const checkList = yield call(checkComplainList, { ...params });

      if (checkList.code !== 2000) {
        message.error(checkList.msg);
        yield put({ type: 'savePreData', payload: { current: 0 } });
      } else if (checkList.data.errorList.length > 0) {
        yield put({ type: 'savePreData', payload: { checkList, current: 1, disableDel: true } });
      } else {
        yield put({ type: 'savePreData', payload: { checkList, current: 1, disableDel: false } });
      }
    },
    *saveExcel({ payload }, { call, put }) {
      const { params } = payload;
      const excelData = yield call(saveDataComplain, { ...params });
      if (excelData.code !== 2000) {
        message.error(excelData.msg);
        yield put({ type: 'savePreData', payload: { current: 2 } });
      } else {
        yield put({ type: 'savePreData', payload: { excelData, current: 3 } });
      }
    },
    *preDelComplain({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(preDelBlComplainList, { ...params });
      if (preDelData.code !== 2000) {
        message.error(preDelData.msg);
        yield put({ type: 'savePreData', payload: { current: 0 } });
      } else if (preDelData.data.successSize > 0) {
        yield put({ type: 'save', payload: { preDelData, current: 1, disableDel: false } });
      } else {
        yield put({ type: 'save', payload: { preDelData, current: 1, disableDel: true } });
      }
    },
    *delComplain({ payload }, { call, put }) {
      const { params } = payload;
      const delData = yield call(delBlComplainList, { ...params });
      if (delData.code !== 2000) {
        message.error(delData.msg);
        yield put({ type: 'savePreData', payload: { current: 1 } });
      } else {
        yield put({ type: 'savePreData', payload: { delData, current: 2 } });
      }
    },
    *getNums({ payload }, { put }) {
      const { nums } = payload;
      yield put({ type: 'savePreData', payload: { nums } });
    },
    *saveFileList({ payload }, { put }) {
      const { fileList } = payload;
      yield put({ type: 'save', payload: { fileList } });
    },
    *editCurrent({ payload }, { put }) {
      const { current } = payload;
      yield put({ type: 'savePreData', payload: { current } });
    },
    *initParams({ payload }, { put }) {
      const { disableDel, nums } = payload;
      yield put({ type: 'save', payload: { disableDel, nums } });
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
