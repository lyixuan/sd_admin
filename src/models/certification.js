// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  certificationList,
  certificationDelete,
  certificationModify,
} from "../services/api";

export default {
  namespace: 'certification',

  state: {
    // 接口返回数据存储
    certificationList: {},
  },

  effects: {
    *certificationList({ payload }, { call, put }) {
      const response = yield call(certificationList, payload.certificationListParams);
      if (response.code === 2000) {
        const certificationListData = response.data || [];
        yield put({ type: 'certificationListSave', payload: { certificationListData } });
      } else {
        message.error(response.msg);
      }
    },
    *certificationDelete({ payload }, { call, put }) {
      // const result = yield call(userDelete, payload.userDeleteParams);
      const result = yield call(certificationDelete, payload.certificationDeleteParams);
      if (result.code === 2000) {
        message.success('删除成功！');
        const response = yield call(certificationList, payload.certificationListParams);
        if (response.code === 2000) {
          const certificationListData = response.data || [];
          yield put({ type: 'certificationListSave', payload: { certificationListData } });
        } else {
          message.error(response.msg);
        }
      } else {
        message.error(result.msg);
      }
    },

    *certificationModify({ payload }, { call, put }) {
      const result = yield call(certificationModify, payload.certificationModifyParams);
      if (result.code === 2000) {
        message.success('更新成功！');
        const response = yield call(certificationList, payload.certificationListParams);
        if (response.code === 2000) {
          const certificationListData = response.data || [];
          yield put({ type: 'certificationListSave', payload: { certificationListData } });
        } else {
          message.error(response.msg);
        }
      } else {
        message.error(result.msg);
      }
    },

  },

  reducers: {

    certificationListSave(state, action) {
      return {
        ...state,
        certificationList: action.payload,
      };
    },

  },
};
