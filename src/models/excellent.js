import { message } from 'antd';
import { excellentList, excellentCaseApplyDetail } from '../services/api';

export default {
  namespace: 'excellent',

  state: {
    // 接口返回数据存储
    dataList: [],
    detailInfo: {},
  },

  effects: {
    // 获取创新案例申请详情
    *excellentCaseApplyDetail({ payload }, { call, put }) {
      const response = yield call(excellentCaseApplyDetail, payload.params);
      if (response.code === 2000) {
        yield put({
          type: 'saveDetail',
          payload: { detailInfo: response.data || {} },
        });
      } else {
        message.error(response.msg);
      }
    },
    // 底表列表
    *excellentList({ payload }, { call, put }) {
      const response = yield call(excellentList, { ...payload });
      const dataList = response.data || {};
      if (response.code !== 2000) {
        message.error(response.msg);
      } else {
        yield put({
          type: 'excellentSave',
          payload: { dataList: dataList.content, totalNum: dataList.totalElements },
        });
      }
    },
  },
  reducers: {
    excellentSave(state, { payload }) {
      const { dataList } = payload;
      if (dataList) {
        dataList.forEach((item, i) => {
          dataList[i].key = i;
        });
      }
      return { ...state, ...payload };
    },
    saveDetail(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
