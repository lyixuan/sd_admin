import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  listOrg,
  getAuditList,
  exportBottomTable,
  auditPublish,
  submitExamineResult,
  findCertificationList,
  auditLogList,
  getSignExamineInfo,
  submitSignResult,
  verifyAuditDataExcel,
  auditSaveExcel,
} from '../services/api';

export default {
  namespace: 'audit',

  state: {
    listOrg: [],
    auditList: [],
    visible: false,
    certificationList: [],
    logData: {},
    signExamineInfo: {},
    signExamineList: [],
    disableDel: null, // 根据接口返回决定是否禁止下一步按钮：true--禁止
    fileList: [],
    isLoading: null,
    current: 0,
  },

  effects: {
    *listOrg({ payload }, { call, put }) {
      const response = yield call(listOrg, payload.params);
      const listData = response && response.data ? [...response.data] : [];
      if (response.code === 2000) {
        const resultData = dataDeal(listData);
        yield put({ type: 'listOrgSave', payload: { resultData } });
      } else {
        message.error(response.msg);
      }
      function dataDeal(list) {
        const result = [];
        list.forEach(v => {
          const obj = {};
          obj.value = v.id;
          obj.label = v.name;
          obj.level = v.level;
          if (v.sub) {
            obj.children = dataDeal(v.sub);
          }
          result.push(obj);
        });
        return result;
      }
    },
    // 获取审核列表
    *getAuditList({ payload }, { call, put }) {
      const response = yield call(getAuditList, payload.obj);
      const listData = response && response.data ? { ...response.data } : {};

      if (response.code === 2000) {
        yield put({ type: 'auditListSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    // 导出底表
    *exportBottomTable({ payload }, { call, put }) {
      const start = payload.params.applyTimeParamStart.split('-');
      const end = payload.params.applyTimeParamEnd.split('-');
      const start1 = start[0].substring(2);
      const start2 = start[1];
      const end1 = end[0].substring(2);
      const end2 = end[1];
      const fileName =
        payload.params.exportTableType === 1
          ? `【${start1}${start2}】班主任业务技能认证-报名表.xlsx`
          : payload.params.assessCyc === 2
            ? `【${start1}${start2}-${end1}${end2}】班主任业务技能认证-认证表-季度.xlsx`
            : `【${start1}${start2}】班主任业务技能认证-认证表-月度.xlsx`;
      const response = yield call(exportBottomTable, payload.params);
      downBlob(response, fileName);
      yield put({ type: 'showModel', payload: { visible: false } });

      function downBlob(blob, name) {
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = name; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      }
    },
    // 发布认证
    *auditPublish({ payload }, { call, put }) {
      const response = yield call(auditPublish, payload.params);
      const backparams = payload.callbackParams;
      if (response.code === 2000) {
        yield put({ type: 'showModel', payload: { visible: false } });
        yield put({ type: 'getAuditList', payload: { obj: backparams } });
      } else {
        message.error(response.msg);
      }
    },
    // 认证审核
    *submitExamineResult({ payload }, { call, put }) {
      const response = yield call(submitExamineResult, payload.params);
      const backparams = payload.callbackParams;
      if (response.code === 2000) {
        yield put({ type: 'showModel', payload: { visible: false } });
        yield put({ type: 'getAuditList', payload: { obj: backparams } });
      } else {
        message.error(response.msg);
      }
    },
    // 认证项目列表
    *findCertificationList({ payload }, { call, put }) {
      const response = yield call(findCertificationList, payload.params);
      const listData = response && response.data ? [...response.data] : [];
      if (response.code === 2000) {
        yield put({ type: 'certificationListSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    // 审核记录
    *auditLogList({ payload }, { call, put }) {
      const response = yield call(auditLogList, payload.params);
      const listData = response && response.data ? { ...response.data } : {};
      if (response.code === 2000) {
        yield put({ type: 'logDataSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    // 获取报名审核列表
    *getSignExamineInfo({ payload }, { call, put }) {
      const response = yield call(getSignExamineInfo, payload.params);
      const listData = response && response.data ? { ...response.data } : {};
      if (response.code === 2000) {
        yield put({ type: 'signExamineInfoSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    // 报名审核提交
    *submitSignResult({ payload }, { call, put }) {
      const response = yield call(submitSignResult, payload.params);
      if (response.code === 2000) {
        yield put(routerRedux.push('/skillCertification/auditList'));
      } else {
        message.error(response.msg);
      }
    },
    // ------ 质检
    *checkQuality({ payload }, { call, put }) {
      const logMsg = [];
      const { params } = payload;
      const checkList = yield call(verifyAuditDataExcel, { ...params });

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
    *saveExcel({ payload }, { call, put }) {
      const { params } = payload;
      const excelData = yield call(auditSaveExcel, { ...params });
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
    listOrgSave(state, action) {
      return {
        ...state,
        listOrg: action.payload.resultData,
      };
    },
    auditListSave(state, action) {
      return {
        ...state,
        auditList: action.payload.listData,
      };
    },
    certificationListSave(state, action) {
      return {
        ...state,
        certificationList: action.payload.listData,
      };
    },
    logDataSave(state, action) {
      return {
        ...state,
        logData: action.payload.listData,
      };
    },
    signExamineInfoSave(state, action) {
      return {
        ...state,
        signExamineList: action.payload.listData.certificationSignInfoList,
        signExamineInfo: action.payload.listData,
      };
    },
    showModel(state, action) {
      return {
        ...state,
        visible: action.payload.visible,
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
