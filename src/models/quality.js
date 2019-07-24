import { message } from 'antd';
import {
  getQualityList,
  checkQualityList,
  delQualityList,
  preDelQualityList,
  verifyConsultIds,
  batchSave,
  saveDataQuality,
} from '../services/api';

export default {
  namespace: 'quality',

  state: {
    nums: '',
    current: 0,
    disableDel: null, // 根据接口返回决定是否禁止下一步按钮：true--禁止
    qualityList: [],
    fileList: [],
    isLoading: null,
    appealType: null,
  },

  effects: {
    *getQualityList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getQualityList, { ...getListParams });
      yield put({ type: 'qualityListSave', payload: { response, getListParams } });
    },
    *checkQuality({ payload }, { call, put }) {
      const logMsg = [];
      const { params } = payload;
      const checkList = yield call(checkQualityList, { ...params });

      if (checkList.code !== 2000) {
        if (checkList.data.excelError) {
          checkList.data.excelError.forEach(item => {
            logMsg.push(item.log);
          });
          message.error(logMsg.join(','));
        } else {
          message.error(checkList.msg);
        }
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
    // 申诉管理接口，批量删除申诉 第一步接口
    *verifyConsultIds({ payload }, { call, put }) {
      const { params } = payload;
      const verifyConsultIdsData = yield call(verifyConsultIds, { ...params });
      const { appealType } = params;
      if (verifyConsultIdsData.code !== 2000) {
        message.error(verifyConsultIdsData.msg);
        yield put({ type: 'save', payload: { current: 0, isLoading: false } });
      } else if (verifyConsultIdsData.data.successSize > 0) {
        yield put({
          type: 'save',
          payload: {
            verifyConsultIdsData,
            appealType,
            current: 1,
            disableDel: false,
            isLoading: false,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            verifyConsultIdsData,
            appealType,
            current: 1,
            disableDel: true,
            isLoading: false,
          },
        });
      }
    },
    // 申诉管理接口，批量删除申诉 第二步
    *batchSave({ payload }, { call, put }) {
      const { params } = payload;
      const batchSaveData = yield call(batchSave, { ...params });
      if (batchSaveData.code !== 2000) {
        message.error(batchSaveData.msg);
        yield put({ type: 'save', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'save', payload: { batchSaveData, current: 2, isLoading: false } });
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
    *getAppealType({ payload }, { put }) {
      const { appealType } = payload;
      yield put({ type: 'save', payload: { appealType } });
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
      const { disableDel, nums, appealType } = payload;
      yield put({ type: 'save', payload: { disableDel, nums, appealType } });
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
