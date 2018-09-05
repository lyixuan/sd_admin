// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  getStaffList,
  getStaffDetail,
  getEmployeeInfo,
  addTransferPost,
  updateTransferPost,
  addDemissionPost,
  editDemissionPost,
} from '../services/staff';

export default {
  namespace: 'staff',

  state: {
    // 接口返回数据存储
    data: {},
    staffDetail: null,
    employeeInfo: null,
  },

  effects: {
    *staffList({ payload }, { call, put }) {
      //  获取员工信息列表
      const response = yield call(getStaffList, payload);
      // console.log(response);
      if (response.code === 2000) {
        const data = response.data || {};
        yield put({ type: 'staffListSave', payload: data });
      } else {
        message.error(response.msg);
      }
    },
    *getStaffDetail({ payload }, { call, put }) {
      // 根据员工id获取员工信息
      const response = yield call(getStaffDetail, payload);
      if (response.code === 2000) {
        const data = response.data || {};
        yield put({ type: 'saveStaffDetail', payload: data });
      } else {
        message.error(response.msg);
      }
    },
    *getEmployeeInfo({ payload }, { call, put }) {
      // 根据员工id,员工状态获取员工信息
      const response = yield call(getEmployeeInfo, payload);
      if (response.code === 2000) {
        const data = response.data || {};
        yield put({ type: 'saveEmployeeInfo', payload: data });
      } else {
        message.error(response.msg);
      }
    },
    *addTransferPost({ payload }, { call, put }) {
      const response = yield call(addTransferPost, payload);
      if (response.code === 2000) {
        message.success('转岗创建成功');
        yield put(routerRedux.push('/privilege/staff/staffList'));
      } else {
        message.error(response.msg);
      }
    },
    *updateTransferPost({ payload }, { call, put }) {
      const response = yield call(updateTransferPost, payload);
      if (response.code === 2000) {
        message.success('编辑转岗成功');
        yield put(routerRedux.push('/privilege/staff/staffList'));
      } else {
        message.error(response.msg);
      }
    },
    *addDemissionPost({ payload }, { call, put }) {
      const response = yield call(addDemissionPost, payload);
      if (response.code === 2000) {
        message.success('离职创建成功');
        yield put(routerRedux.push('/privilege/staff/staffList'));
      } else {
        message.error(response.msg);
      }
    },
    *editDemissionPost({ payload }, { call, put }) {
      const response = yield call(editDemissionPost, payload);
      if (response.code === 2000) {
        message.success('离职创建成功');
        yield put(routerRedux.push('/privilege/staff/staffList'));
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    saveStaffDetail(state, { payload }) {
      const staffDetail = payload;
      return {
        ...state,
        staffDetail,
      };
    },
    saveEmployeeInfo(state, { payload }) {
      const employeeInfo = payload;
      return {
        ...state,
        employeeInfo,
      };
    },
    staffListSave(state, { payload }) {
      const data = payload;
      return {
        ...state,
        data,
      };
    },
  },
};
