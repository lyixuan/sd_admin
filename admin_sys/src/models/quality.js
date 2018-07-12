import { message } from 'antd';
import { getQualityList, checkQuality, delQualityList, preDelQualityList } from '../services/api';

export default {
  namespace: 'quality',

  state: {
    nums: '',
    current: 0,
    qualityList:[],
  },

  effects: {
    *getQualityList({ payload }, { call, put }) {
      const response = yield call(getQualityList, payload.qualityListParams);
      // console.log(response);
      yield put({ type: 'qualityListSave', payload: { response } });
    },
    *checkQuality({ payload }, { call, put }) {
      const { data } = payload;
      const response = yield call(checkQuality, { ...data });
      console.log(response);
      yield put({ type: 'save', payload: { response } });
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
    *editCurrent({ payload }, { put }) {
      const { current } = payload;
      yield put({ type: 'save', payload: { current } });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    qualityListSave(state, action) {
      return { ...state,
        qualityList: action.payload,
      };
    },
  },
};
