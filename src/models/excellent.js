import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { excellentList, excellentCaseApplyDetail, getPreInfo, excellentAdd } from '../services/api';

export default {
  namespace: 'excellent',

  state: {
    // 接口返回数据存储
    totalNum: null,
    dataList: [],
    detailInfo: {},
    preInfo: {}, // 添加申请-获取用户和认证项目信息
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
          payload: { dataList: dataList.content, totalNum: dataList.totalElements, ...payload },
        });
      }
    },
    *getPreInfo({ payload }, { call, put }) {
      const response = yield call(getPreInfo, { ...payload });
      const preInfo = response.data || {};
      if (response.code !== 2000) {
        message.error(response.msg);
      } else {
        yield put({
          type: 'saveDetail',
          payload: { preInfo },
        });
      }
    },
    *excellentAdd({ payload }, { call, put }) {
      const response = yield call(excellentAdd, { ...payload });
      if (response.code === 2000) {
        message.success('成功添加申请！');
        yield put(routerRedux.push('/excellent/excellentCaseList'));
      } else {
        message.error(response.msg);
      }
    },
  },
  reducers: {
    excellentSave(state, { payload }) {
      const { dataList, pageSize, pageNum } = payload;

      if (dataList) {
        dataList.forEach((item, i) => {
          dataList[i].key = pageNum * pageSize + (1 + i); // 自己计算每页数据排序
        });
      }
      return { ...state, ...payload };
    },
    saveDetail(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
