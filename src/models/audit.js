import { message } from 'antd';
import { listOrg, getAuditList, exportBottomTable } from '../services/api';

export default {
  namespace: 'audit',

  state: {
    listOrg: [],
    auditList: [],
    visible: false,
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
    *getAuditList({ payload }, { call, put }) {
      const response = yield call(getAuditList, payload.obj);
      const listData = response && response.data ? { ...response.data } : {};

      if (response.code === 2000) {
        yield put({ type: 'auditListSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
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
    showModel(state, action) {
      return {
        ...state,
        visible: action.payload.visible,
      };
    },
  },
};
