// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { listOrg } from '../services/api';

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
    *getAuditList({ put }) {
      // *getAuditList({ payload }, { call, put }) {
      // const response = yield call(getAuditList, payload.params);
      // const listData = response && response.data ? [...response.data] : [];
      const listData = [
        {
          id: 1,
          code: 777,
          name: '小米',
          orgName: '学院abc',
          certificationItemName: '项目111',
          assessCycStr: '月度',
          applyTimeMonth: '2019-01',
          signStatusStr: '已审核',
          signStatus: 2,
          signResultStr: '未通过',
          examineStatusStr: '',
          examineResultStr: '',
        },
        {
          id: 2,
          code: 888,
          name: '小ming',
          orgName: '学院addfd',
          certificationItemName: '项目22222',
          assessCycStr: '月度',
          applyTimeMonth: '2019-01',
          signStatusStr: '待审核',
          signStatus: 1,
          signResultStr: '',
          examineStatusStr: '',
          examineStatus: 2,
          examineResultStr: '',
        },
        {
          id: 3,
          code: 999,
          name: '小minewe',
          orgName: '学院addfd',
          certificationItemName: '项目333',
          assessCycStr: '月度',
          applyTimeMonth: '2019-02',
          signStatusStr: '已审核',
          signResult: 1,
          signResultStr: '通过',
          examineStatus: 1,
          examineStatusStr: '待审核',
          examineResultStr: '',
        },
        {
          id: 4,
          code: 999,
          name: '小minewe',
          orgName: '学院addfd',
          certificationItemName: '项目333',
          assessCycStr: '月度',
          applyTimeMonth: '2019-02',
          signStatusStr: '已审核',
          signStatus: 2,
          signResult: 1,
          signResultStr: '通过',
          examineStatusStr: '已审核',
          examineStatus: 2,
          examineResultStr: '',
        },
      ];
      yield put({ type: 'auditListSave', payload: { listData } });

      // if (response.code === 2000) {
      //   yield put({ type: 'auditListSave', payload: { listData } });
      // } else {
      //   message.error(response.msg);
      // }
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
