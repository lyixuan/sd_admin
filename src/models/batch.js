import { message } from 'antd';
import { verifyOrdIds, deleteOrdIds } from '../services/api';

export default {
  namespace: 'batch',

  state: {
    nums: '',
    current: 0,
    disableDel: null, // 根据接口返回决定是否禁止下一步按钮：true--禁止
    qualityList: [],
    fileList: [],
    isLoading: null,
    verifyOrdIdsData: [],
    deleteOrdIdsData: [],
  },

  effects: {
    // 申诉管理接口，批量删除申诉 第一步接口
    *verifyOrdIds({ payload }, { call, put }) {
      const { params } = payload;
      const verifyOrdIdsData = yield call(verifyOrdIds, { ...params });
      if (verifyOrdIdsData.code !== 20000) {
        message.error(verifyOrdIdsData.msg);
        yield put({ type: 'save', payload: { current: 0, isLoading: false } });
      } else if (verifyOrdIdsData.data.successSize > 0) {
        yield put({
          type: 'save',
          payload: {
            verifyOrdIdsData,
            current: 1,
            disableDel: false,
            isLoading: false,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            verifyOrdIdsData,
            current: 1,
            disableDel: true,
            isLoading: false,
          },
        });
      }
    },
    // 申诉管理接口，批量删除申诉 第二步
    *deleteOrdIds({ payload }, { call, put }) {
      const { params } = payload;
      const deleteOrdIdsData = yield call(deleteOrdIds, { ...params });
      if (deleteOrdIdsData.code !== 20000) {
        message.error(deleteOrdIdsData.msg);
        yield put({ type: 'save', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'save', payload: { deleteOrdIdsData, current: 2, isLoading: false } });
      }
    },

    *getNums({ payload }, { put }) {
      const { nums } = payload;
      yield put({ type: 'save', payload: { nums } });
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
    qualityListSave(state, action) {
      return {
        ...state,
        qualityList: action.payload,
      };
    },
  },
};
