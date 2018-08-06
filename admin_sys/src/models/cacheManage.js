import { message } from 'antd';
import { updateCache } from '../services/api';

export default {
  namespace: 'cacheManage',

  state: {
    // 接口返回数据存储
    cacheData: null,
  },

  effects: {
    *updateCache({ payload }, { call, put }) {
      console.log(payload.updateCacheParams)
      const cacheData = yield call(updateCache, payload.updateCacheParams);
      if (cacheData.code === 2000) {
        yield put({ type: 'updateCacheSave', payload: { cacheData } });
      } else {
        message.error(cacheData.msg);
      }
    },
  },

  reducers: {
    updateCacheSave(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
