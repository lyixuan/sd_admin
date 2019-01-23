import { message } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment/moment';
import {
  creditAdjustGetList,
  creditAdjustDelById,
  creditAdjustGetDetail,
  creditAdjustSaveOrModify,
  organizationList,
  findAllCollege,
} from '../services/api';

export default {
  namespace: 'scoreAdjust',

  state: {
    list: {},
    orgList: [],
    college: [],
    // 新增编辑初始化字段
    detail: {},
    adjustDate: undefined,
    type: undefined,
    creditScore: undefined,
    groupType: undefined,
    orgCheckList: [],
    familyType: undefined,
    reason: undefined,
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(creditAdjustGetList, payload.obj);
      if (response && response.code === 2000) {
        const listData = response && response.data ? { ...response.data } : {};
        yield put({ type: 'listSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    *findAllCollege({ payload }, { call, put }) {
      const response = yield call(findAllCollege, payload.obj);
      if (response && response.code === 2000) {
        const listData = response && response.data ? [...response.data] : [];
        yield put({ type: 'collegeSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
    *delById({ payload }, { call }) {
      const response = yield call(creditAdjustDelById, payload);
      if (response && response.code === 2000) {
        yield call(payload.action);
      } else if (response && response.code === 1201) {
        message.error('该数据不可删除');
      } else {
        message.error(response.msg);
      }
    },
    *getDetailById({ payload }, { call, put }) {
      const response = yield call(creditAdjustGetDetail, payload);
      if (response && response.code === 2000) {
        const listData = response && response.data ? { ...response.data } : {};
        const bizDate = moment(new Date(listData.adjustDate)).format('YYYY-MM-DD');

        const response2 = yield call(organizationList, { bizDate });
        if (response2 && response2.code === 2000) {
          const listData2 = response2.data ? [...response2.data] : [];
          yield put({ type: 'orgSave', payload: { listData: listData2 } });
          yield call(payload.changeOption, listData.groupType);
          yield put({ type: 'detailSave', payload: { listData } });
        } else {
          message.error(response.msg);
        }
      } else {
        message.error(response.msg);
      }
    },
    *saveDetail({ payload }, { call, put }) {
      const response = yield call(creditAdjustSaveOrModify, payload.params);
      if (response && response.code === 2000) {
        yield put(routerRedux.push('/appeal/scoreAdjustList'));
      } else if (response && response.code === 1202) {
        message.error('该数据不可修改');
      } else {
        message.error(response.msg);
      }
    },
    *organizationList({ payload }, { call, put }) {
      const response = yield call(organizationList, payload);
      if (response && response.code === 2000) {
        const listData = response.data ? [...response.data] : [];
        yield put({ type: 'orgSave', payload: { listData } });
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    listSave(state, action) {
      return {
        ...state,
        list: action.payload.listData,
      };
    },
    orgSave(state, action) {
      return {
        ...state,
        orgList: action.payload.listData,
      };
    },
    collegeSave(state, action) {
      return {
        ...state,
        college: action.payload.listData,
      };
    },
    detailSave(state, action) {
      return {
        ...state,
        adjustDate: moment(new Date(action.payload.listData.adjustDate)),
        type: action.payload.listData.type,
        creditScore: action.payload.listData.creditScore,
        groupType: action.payload.listData.groupType,
        orgCheckList: [
          action.payload.listData.collegeId,
          action.payload.listData.familyId,
          action.payload.listData.groupId,
        ],
        familyType: action.payload.listData.familyType,
        reason: action.payload.listData.reason,
      };
    },
    initDetail(state) {
      return {
        ...state,
        adjustDate: undefined,
        type: undefined,
        creditScore: undefined,
        groupType: undefined,
        orgCheckList: [],
        familyType: undefined,
        reason: undefined,
      };
    },
  },
};
