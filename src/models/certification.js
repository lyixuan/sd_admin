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
  getItemById,
  countItemByStatus,
  delIcon,
  uploadIcon,
} from "../services/api";


export default {
  namespace: 'certification',

  state: {
    // 接口返回数据存储
    certificationList: {},
    findAllOrgList:{},
    getItemById:{},
    countItemByStatus:{},
    fileList1:[],
    fileList2:[],
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
      const response = yield call(findAllOrg, payload.nullParams);
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

    *saveOrModifySubItem({ payload }, { call,put }) {
      const addPositionData = yield call(saveOrModifySubItem, payload.saveOrModifySubItemParams);
      if (addPositionData.code === 2000) {
        const response = yield call(getItemById, payload.params);
        if (response.code === 2000) {
          const getItemByIdData = response.data || [];
          yield put({ type: 'getItemByIdSave', payload: { getItemByIdData } });
        } else {
          message.error(response.msg);
        }
      } else {
        message.error(addPositionData.msg);
      }
    },

    *delSubItemById({ payload }, { call,put }) {
      const result = yield call(delSubItemById, payload.params);
      if (result.code === 2000) {
        message.success('删除成功！');
        const response = yield call(getItemById, payload.param);
        if (response.code === 2000) {
          const getItemByIdData = response.data || [];
          yield put({ type: 'getItemByIdSave', payload: { getItemByIdData } });
        } else {
          message.error(response.msg);
        }
      } else {
        message.error(result.msg);
      }
    },

    *getItemById({ payload }, { call,put }) {
      const result = yield call(getItemById, payload.params);
      if (result.code === 2000) {
        const getItemByIdData = result.data || [];
        yield put({ type: 'getItemByIdSave', payload: { getItemByIdData } });
      } else {
        message.error(result.msg);
      }
    },

    *countItemByStatus({ payload }, { call ,put }) {
      const result = yield call(countItemByStatus, payload.countItemByStatusParams);
      if (result.code === 2000) {
        const countItemByStatusData = result.data || [];
        yield put({ type: 'countItemByStatusSave', payload: { countItemByStatusData } });
      } else {
        message.error(result.msg);
      }
    },

    *uploadIcon({ payload }, { call ,put }) {
      const result = yield call(uploadIcon, payload.params);
      if (result.code === 2000) {
        const uploadIconData = result.data || [];
        yield put({ type: 'save', payload: { uploadIconData } });
      } else {
        message.error(result.msg);
      }
    },

    *delIcon({ payload }, { call }) {
      const result = yield call(delIcon, payload.params);
      if (result.code === 2000) {
        message.success('删除成功！');
      } else {
        message.error(result.msg);
      }
    },

    *saveFileList({ payload }, { put }) {
      const { type,fileList } = payload;
      if(type===1){
        const fileList1=fileList
        yield put({ type: 'save', payload: { fileList1} });
      }else{
        const fileList2=fileList
        yield put({ type: 'save', payload: { fileList2} });
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
    getItemByIdSave(state, action) {
      return {
        ...state,
        getItemById: action.payload,
      };
    },
    countItemByStatusSave(state, action) {
      return {
        ...state,
        countItemByStatus: action.payload,
      };
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },

  },
};
