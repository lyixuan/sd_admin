import { message } from 'antd';
import { excellentList } from '../services/api';

export default {
  namespace: 'excellent',

  state: {
    // 接口返回数据存储
    dataList: [
      {
        key: 1,
        applyTime: '2019-02-15T06:09:43.035Z',
        auth: 'string',
        authRemark: 'string',
        certificationDetailId: 0,
        certificationItemName: 'string',
        sign: 'string',
        signRemark: 'string',
      },
      {
        key: 2,
        applyTime: '2019-02-15T06:09:43.035Z',
        auth: 'string',
        authRemark: 'string',
        certificationDetailId: 0,
        certificationItemName: 'string',
        sign: 'string',
        signRemark: 'string',
      },
    ],
    totalNum: null,
  },

  effects: {
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
  },
};
