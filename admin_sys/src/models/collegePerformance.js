import { message } from 'antd';
import {
  getCollegePerformanceList,
  getPersonalPerformanceList,
  exportCollegeKpi,
  importKpiData,
  saveKpiData,
} from '../services/api';

export default {
  namespace: 'performance',

  state: {
    isLoading: null,
  },

  effects: {
    *getCollegeList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getCollegePerformanceList, { ...getListParams });
      if (response.code === 2000) {
        yield put({ type: 'saveCollege', payload: { response, getListParams } });
      } else {
        message.error(response.msg);
      }
    },
    *getPersonalList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(getPersonalPerformanceList, { ...getListParams });

      if (response.code === 2000) {
        yield put({ type: 'savePersonal', payload: { response, getListParams } });
      } else {
        message.error(response.msg);
      }
    },
    *exportCollegeKpi({ payload }, { call, put }) {
      const { getListParams } = payload;
      const response = yield call(exportCollegeKpi, { ...getListParams });

      if (response.code === 2000) {
        yield put({ type: 'savePersonal', payload: { response, getListParams } });
      } else {
        message.error(response.msg);
      }
    },
    *importKpiData({ payload }, { call, put }) {
      const logMsg = [];
      const { params } = payload;
      const checkList = yield call(importKpiData, { ...params });

      if (checkList.code !== 2000) {
        if (checkList.data.excelError) {
          checkList.data.excelError.forEach(item => {
            logMsg.push(item.log);
          });
          message.error(logMsg.join(','));
        } else {
          message.error(checkList.msg);
        }
        yield put({ type: 'savePersonal', payload: { current: 0, isLoading: false } });
      } else if (checkList.data.errorList.length > 0) {
        yield put({
          type: 'savePersonal',
          payload: { checkList, current: 1, disableDel: true, isLoading: false },
        });
      } else {
        yield put({
          type: 'savePersonal',
          payload: { checkList, current: 1, disableDel: false, isLoading: false },
        });
      }
    },
    *saveKpiData({ payload }, { call, put }) {
      const { params } = payload;
      const excelData = yield call(saveKpiData, { ...params });
      if (excelData.code !== 2000) {
        message.error(excelData.msg);
        yield put({ type: 'savePersonal', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'savePersonal', payload: { current: 2, isLoading: false } });
      }
    },
  },

  reducers: {
    saveCollege(state, action) {
      return {
        ...state,
        dataCollege: action.payload,
      };
    },
    savePersonal(state, action) {
      return {
        ...state,
        dataPersonal: action.payload,
      };
    },
  },
};
