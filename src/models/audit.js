import { message } from 'antd';
import { listOrg, getAuditList } from '../services/api';

export default {
  namespace: 'audit',

  state: {
    listOrg: [],
    auditList: [],
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
  },
};
