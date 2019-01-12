// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { routerRedux } from "dva/router";
import {
  certificationList,
  certificationDelete,
  certificationModify,
  findAllOrg,
  saveOrModifyItem,
  saveOrModifySubItem,
  delSubItemById,
  // uploadIcon,
  // delIcon,
} from "../services/api";


export default {
  namespace: 'certification',

  state: {
    // 接口返回数据存储
    certificationList: {},
    findAllOrgList:{},
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

    *findAllOrg({ payload }, { call, put }) {
      const response = yield call(findAllOrg, payload.params);
      if (response.code === 2000) {
        const collegeList = response.data || [];
        yield put({ type: 'findAllOrgSave', payload: { collegeList } });
      } else {
        message.error(response.msg);
      }
    },

    *saveOrModifyItem({ payload }, { call, put }) {
      const result = yield call(saveOrModifyItem, payload.saveOrModifyItemParams);
      if (result.code === 2000) {
        message.success('操作成功');
        yield put(routerRedux.goBack());
      } else {
        message.error(result.msg);
      }
    },

    *saveOrModifySubItem({ payload }, { call }) {
      const addPositionData = yield call(saveOrModifySubItem, payload.saveOrModifySubItemParams);
      if (addPositionData.code === 2000) {
        message.success('操作成功！');
      } else {
        message.error(addPositionData.msg);
      }
    },

    *delSubItemById({ payload }, { call }) {
      const result = yield call(delSubItemById, payload.delSubItemByIdParams);
      if (result.code === 2000) {
        message.success('删除成功！');
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
    findAllOrgSave(state, action) {
      return {
        ...state,
        findAllOrgList: action.payload,
      };
    },

  },
};
