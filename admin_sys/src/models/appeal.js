// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { appealList, addAppealList } from '../services/api';

export default {
  namespace: 'appeal',

  state: {
    // 接口返回数据存储
    appealListData: null,
    addAppealData: null,
  },

  effects: {
    *appealList({ payload }, { call, put }) {
      const appealListData = yield call(appealList, payload.appealListParams);
      if (appealListData.code === 2000) {
        yield put({ type: 'appealListSave', payload: { appealListData } });
      } else {
        message.error(appealListData.msg);
      }
    },
    *addAppeal({ payload }, { call, put }) {
      const addAppealData = yield call(addAppealList, payload.addAppealParams);
      if (addAppealData.code === 2000) {
        message.success('成功添加申诉！');
        const appealListData = yield call(appealList, payload.appealListParams);
        yield put({ type: 'appealListSave', payload: { appealListData } });
      } else {
        message.error(addAppealData.msg);
      }
    },
  },

  reducers: {
    appealListSave(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
