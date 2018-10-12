import { message } from 'antd';
import {
  getCollegePerformanceList,
  getPersonalPerformanceList,
  exportCollegeAchievement,
  exportCollegeDetailKpi,
  listCollege, // 导出绩效金额的导出范围
  importKpiData,
  saveKpiData,
} from '../services/api';

export default {
  namespace: 'performance',

  state: {
    fileList: [],
    current: 0,
    disableDel: null,
    isLoading: null,
    listCollege: null,
  },

  effects: {
    *getExportCollegeList({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(listCollege);
      if (response.code === 2000) {
        yield put({ type: 'saveListCollege', payload: { listCollege: response.data } });
      } else {
        message.error(response.msg);
      }
    },
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
    *exportCollegeAchievement({ payload }, { call, put }) {
      const response = yield call(exportCollegeAchievement, { ...payload });

      if (response.code === 2000) {
        yield put({ type: 'save', payload: { response, payload } });
      } else {
        message.error(response.msg);
      }
    },
    *exportCollegeDetailKpi({ payload }, { call, put }) {
      const response = yield call(exportCollegeDetailKpi, { ...payload });

      if (response.code === 2000) {
        yield put({ type: 'save', payload: { response, payload } });
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
        yield put({ type: 'save', payload: { current: 0, isLoading: false } });
      } else if (checkList.data.errorList.length > 0) {
        yield put({
          type: 'save',
          payload: { checkList, current: 1, disableDel: true, isLoading: false },
        });
      } else {
        yield put({
          type: 'save',
          payload: { checkList, current: 1, disableDel: false, isLoading: false },
        });
      }
    },
    *saveKpiData({ payload }, { call, put }) {
      const { params } = payload;
      const excelData = yield call(saveKpiData, { ...params });
      if (excelData.code !== 2000) {
        message.error(excelData.msg);
        yield put({ type: 'save', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'save', payload: { current: 2, isLoading: false } });
      }
    },
    *saveFileList({ payload }, { put }) {
      const { fileList } = payload;
      yield put({ type: 'save', payload: { fileList } });
    },
    *editCurrent({ payload }, { put }) {
      const { current } = payload;
      yield put({ type: 'save', payload: { current, isLoading: false } });
    },
    *editLoading({ payload }, { put }) {
      const { isLoading } = payload;
      yield put({ type: 'save', payload: { isLoading } });
    },
    *initParams({ payload }, { put }) {
      const { disableDel, nums } = payload;
      yield put({ type: 'save', payload: { disableDel, nums } });
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
    saveListCollege(state, action) {
      const dealList = {};
      action.payload.listCollege.forEach(item => {
        dealList[item.objId] = item.objShortName;
      });
      return {
        ...state,
        listCollege: dealList,
      };
    },
    save(state, action) {
      const { checkList } = action.payload;
      if (checkList) {
        const { errorList } = checkList.data;
        if (errorList) {
          errorList.forEach((item, i) => {
            errorList[i].key = i;
          });
        }
      }
      return { ...state, ...action.payload };
    },
  },
};
