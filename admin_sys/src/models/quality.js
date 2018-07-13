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
    qualityList: [],
  },

  effects: {
    *getQualityList({ payload }, { call, put }) {
      const response = yield call(getQualityList, payload.qualityListParams);
      // console.log(response);
      yield put({ type: 'qualityListSave', payload: { response } });
    },
    *checkQuality({ payload }, { call, put }) {
      const { params } = payload;
      const checkList = yield call(checkQualityList, { ...params });
      if (checkList.code !== 2000) {
        message.error(checkList.msg);
        yield put({ type: 'save', payload: { current: 0 } });
      } else {
        yield put({ type: 'save', payload: { checkList, current: 1 } });
      }
    },
    *saveExcel({ payload }, { call, put }) {
      const { params } = payload;
      const excelData = yield call(saveDataQuality, { ...params });
      if (excelData.code !== 2000) {
        message.error(excelData.msg);
        yield put({ type: 'savePreData', payload: { current: 1 } });
      } else {
        yield put({ type: 'savePreData', payload: { excelData, current: 2 } });
      }
    },
    *preDelQuality({ payload }, { call, put }) {
      const { params } = payload;
      const preDelData = yield call(preDelQualityList, { ...params });
      if (preDelData.code !== 2000) {
        message.error(preDelData.msg);
        yield put({ type: 'save', payload: { current: 0 } });
      } else {
        yield put({ type: 'save', payload: { preDelData, current: 1 } });
      }
    },
    *delQuality({ payload }, { call, put }) {
      const { params } = payload;
      const delData = yield call(delQualityList, { ...params });
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
    *saveFileList({ payload }, { put }) {
      const { fileList } = payload;
      yield put({ type: 'save', payload: { fileList } });
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
    qualityListSave(state, action) {
      return {
        ...state,
        qualityList: action.payload,
      };
    },
  },
};
