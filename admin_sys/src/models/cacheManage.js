import { message } from 'antd';
import { updateCache } from '../services/api';

export default {
  namespace: 'cacheManage',

  state: {
    // 接口返回数据存储
  },

  effects: {
    *updateCache({ payload }, { call }) {
      const cacheData = yield call(updateCache, payload.updateCacheParams);
      if (cacheData.code === 2000) {
        message.success('缓存刷新成功！');
      } else {
        message.error(cacheData.msg);
      }
    },
  },

  reducers: {
  },
};
