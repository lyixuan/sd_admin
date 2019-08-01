import { message } from 'antd';
import {
  // incomeOrderList,
  recommendList,
  // importCheck,
  // importUpload,
  // deleteCheck,
  // deleteReview,
  // deleteRecommend,
  createIncomeCheck,
  createIncomeData,
} from '../services/api';

export default {
  namespace: 'createIncome',

  state: {
    nums: '',
    current: 1,
    disableDel: null, // 根据接口返回决定是否禁止下一步按钮：true--禁止
    qualityList: [],
    fileList: [],
    isLoading: null,
  },

  effects: {
    *recommendList({ payload }, { call, put }) {
      const { getListParams } = payload;
      // const response = yield call(incomeOrderList, { ...getListParams });
      const response = yield call(recommendList, { ...getListParams });
      yield put({ type: 'pureSave', payload: { response, getListParams } });
    },
    *createIncomeCheck({ payload }, { call, put }) {
      const logMsg = [];
      const checkList = yield call(createIncomeCheck, { ...payload });
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
    *createIncomeData({ payload }, { call, put }) {
      const excelData = yield call(createIncomeData, { ...payload });
      if (excelData.code !== 20000) {
        message.error(excelData.msg);
        yield put({ type: 'save', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'save', payload: { current: 2, isLoading: false } });
      }
    },
    // *deleteCheck({ payload }, { call, put }) {
    //   const { params } = payload;
    //   const preDelData = yield call(deleteCheck, { ...params });

    //   if (preDelData.code !== 2000) {
    //     message.error(preDelData.msg);
    //     yield put({ type: 'save', payload: { current: 0, isLoading: false } });
    //   } else if (preDelData.data.successCount > 0) {
    //     yield put({
    //       type: 'save',
    //       payload: { preDelData, current: 1, disableDel: false, isLoading: false },
    //     });
    //   } else {
    //     yield put({
    //       type: 'save',
    //       payload: { preDelData, current: 1, disableDel: true, isLoading: false },
    //     });
    //   }
    // },
    // *deleteReview({ payload }, { call, put }) {
    //   const delData = yield call(deleteReview, { ...payload });
    //   if (delData.code !== 2000) {
    //     message.error(delData.msg);
    //     yield put({ type: 'save', payload: { current: 1, isLoading: false } });
    //   } else {
    //     yield put({
    //       type: 'save',
    //       payload: { delData: delData.data, current: 2, isLoading: false },
    //     });
    //   }
    // },
    // *deleteRecommend({ payload }, { call, put }) {
    //   const delSucessData = yield call(deleteRecommend, { ...payload });
    //   if (delSucessData.code !== 2000) {
    //     message.error(delSucessData.msg);
    //     yield put({ type: 'save', payload: { current: 2, isLoading: false } });
    //   } else {
    //     yield put({
    //       type: 'save',
    //       payload: { delSucessData: delSucessData.data, current: 3, isLoading: false },
    //     });
    //   }
    // },
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
