// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getRangeDate, getDate } from '../services/api';

export default {
  namespace: 'bottomTable',

  state: {
    // 接口返回数据存储
    dataList: [{ ordId: 2 }],
    disDateList: [],
    addbottomTableData: null,
    dateArea: {
      beginTime: '',
      endTime: '',
      id: 1,
    },
  },

  effects: {
    // 不可选时间列表
    *getDates({ payload }, { call, put }) {
      const reponse = yield call(getDate, { ...payload });
      const disDateList = reponse.data || {};
      yield put({
        type: 'saveTime',
        payload: { disDateList },
      });
      if (reponse.code !== 2000) {
        message.error(reponse.msg);
      }
    },
    // 时间区间
    *getRange(_, { call, put }) {
      const response = yield call(getRangeDate);
      if (response.code === 2000) {
        const [dateArea] = response.data || [];
        console.log(dateArea);
        yield put({
          type: 'saveTime',
          payload: { dateArea },
        });
      }
    },
  },

  reducers: {
    bottomTableListSave(state, action) {
      return { ...state, ...action.payload };
    },
    saveTime(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
