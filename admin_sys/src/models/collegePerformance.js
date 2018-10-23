import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  getCollegePerformanceList,
  getPersonalPerformanceList,
  exportCollegeAchievement,
  exportCollegeDetailKpi,
  listCollege, // 导出绩效金额的导出范围
  importKpiData,
  saveKpiData,
  findActualKpiInfo,
  updateActualKpi,
} from '../services/api';

function tagLoad(blob, name) {
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = `${name}.xlsx`;
  a.click();
}
export default {
  namespace: 'performance',

  state: {
    fileList: [],
    current: 0,
    disableDel: null,
    isLoading: null,
    listCollege: null,
    actualKpiInfo: null, //  某员工绩效详情
  },

  effects: {
    *getExportCollegeList(_, { call, put }) {
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
      const response = yield call(getPersonalPerformanceList, payload);

      if (response.code === 2000) {
        const data = Array.isArray(response.data) ? response.data : [];
        yield put({ type: 'savePersonal', payload: data });
      } else {
        message.error(response.msg);
      }
    },
    *exportCollegeAchievement({ payload }, { call }) {
      const { type, keyYM, collegeName, dateTime } = payload;
      const response = yield call(exportCollegeAchievement, { type, keyYM });
      const excelName = `绩效金额-${collegeName}-${dateTime}`;
      yield call(tagLoad, response, excelName);

      // if (response.code === 2000) {
      //   yield put({ type: 'save', payload: { response, payload } });
      // } else {
      //   message.error(response.msg);
      // }
    },
    *exportCollegeDetailKpi({ payload }, { call }) {
      const { type, keyYM, collegeName, dateTime } = payload;
      const response = yield call(exportCollegeDetailKpi, { type, keyYM });
      const excelName = `绩效详情-${collegeName}-${dateTime}`;
      yield call(tagLoad, response, excelName);
      // if (response.code === 2000) {
      //   yield put({ type: 'save', payload: { response, payload } });
      // } else {
      //   message.error(response.msg);
      // }
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
    *findActualKpiInfo({ payload }, { call, put }) {
      const response = yield call(findActualKpiInfo, payload);
      if (response.code === 2000) {
        yield put({
          type: 'saveActualKpiInfo',
          payload: response.data,
        });
      } else {
        message.error(response.msg);
      }
    },

    *updateActualKpi({ payload }, { call, put }) {
      const response = yield call(updateActualKpi, payload);
      if (response.code === 2000) {
        message.success('编辑绩效成功');
        yield put(routerRedux.goBack());
      } else {
        message.error(response.msg);
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
    savePersonal(state, { payload }) {
      const dataPersonal = payload;
      return {
        ...state,
        dataPersonal,
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
    saveActualKpiInfo(state, { payload }) {
      const actualKpiInfo = payload || {};
      return { ...state, actualKpiInfo };
    },
  },
};
