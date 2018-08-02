// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { appealList, addAppealList } from '../services/api';

export default {
  namespace: 'appeal',

  state: {
    // 接口返回数据存储
    appealList: [],
  },

  effects: {
    *appealList({ payload }, { call, put }) {
      const response = yield call(appealList, payload.appealListParams);
      if (response.code === 2000) {
        yield put({ type: 'appealListSave', payload: { response } });
      } else {
        message.error(response.msg);
      }
    },
    *addAppeal({ payload }, { call, put }) {
      const result = yield call(addAppealList, payload.addAppealParams);
      if (result.code === 2000) {
        message.success('成功添加申诉！');
        const response = yield call(appealList, payload.appealListParams);
        yield put({ type: 'appealListSave', payload: { response } });
      } else {
        message.error(result.msg);
      }
    },
  },

  reducers: {
    appealListSave(state, action) {
      return {
        ...state,
        appealList: action.payload,
      };
    },
  },
};
