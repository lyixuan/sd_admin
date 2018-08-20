import { message } from 'antd';
import { updateCache, cacheResult } from '../services/api';

export default {
  namespace: 'cacheManage',

  state: {
    // 接口返回数据存储
    cacheListData: null,
  },

  effects: {
    *updateCache({ payload }, { call ,put}) {
      const cacheData = yield call(updateCache, payload.updateCacheParams);
      if (cacheData.code === 2000) {
        message.success('缓存刷新处理中，查看最新结果请点击刷新！');
        const cacheListData = yield call(cacheResult, {});
        if (cacheListData.code === 2000) {
          yield put({ type: 'appealListSave', payload: { cacheListData } });
        } else {
          message.error(cacheListData.msg);
        }
      } else {
        message.error(cacheData.msg);
      }
    },
    *cacheList({ payload }, { call, put }) {
      const cacheListData = yield call(cacheResult, payload.cacheListParams);
      if (cacheListData.code === 2000) {
        message.success('缓存刷新成功！');
        yield put({ type: 'appealListSave', payload: { cacheListData } });
      } else {
        message.error(cacheListData.msg);
      }
    },
  },

  reducers: {
    appealListSave(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
