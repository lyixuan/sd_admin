import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  userList,
  updateUserOrg,
  updateUserbasicInfo,
  getUserRoleList,
  wechatList,
  userAdd,
  listOrg,
  deletePosition,
  updateUserPositionInfo,
  addPosition,
  getUserlist,
} from '../services/api';

export default {
  namespace: 'user',

  state: {
    // 接口返回数据存储
    userList: {},
    wechatList: [],
    getUserRoleList: [],
    listOrg: [],
    getUserlistData: null,
  },

  effects: {
    *userList({ payload }, { call, put }) {
      const response = yield call(userList, payload.userListParams);
      if (response.code === 2000) {
        const userListData = response.data || [];
        yield put({ type: 'userListSave', payload: { userListData } });
      } else {
        message.error(response.msg);
      }
    },
    *updateUserOrg({ payload }, { call, put }) {
      const result = yield call(updateUserOrg, payload.updateUserOrgParams);
      if (result.code === 2000) {
        message.success('更新成功！');
        const response = yield call(userList, payload.userListParams);
        if (response.code === 2000) {
          const userListData = response.data || [];
          yield put({ type: 'userListSave', payload: { userListData } });
        } else {
          message.error(response.msg);
        }
      } else {
        message.error(result.msg);
      }
    },
    *updateUserbasicInfo({ payload }, { call, put }) {
      const result = yield call(updateUserbasicInfo, payload.updateUserInfoParams);
      if (result.code === 2000) {
        message.success('用户编辑成功！');
        yield put(routerRedux.goBack());
      } else {
        message.error(result.msg);
      }
    },
    *userDelete({ payload }, { call, put }) {
      // const result = yield call(userDelete, payload.userDeleteParams);
      const result = yield call(deletePosition, payload.userDeleteParams);
      if (result.code === 2000) {
        message.success('用户岗位删除成功！');
        const response = yield call(userList, payload.userListParams);
        if (response.code === 2000) {
          const userListData = response.data || [];
          yield put({ type: 'userListSave', payload: { userListData } });
        } else {
          message.error(response.msg);
        }
      } else {
        message.error(result.msg);
      }
    },
    *userAdd({ payload }, { call, put }) {
      const result = yield call(userAdd, payload.userAddParams);
      if (result.code === 2000) {
        message.success('用户创建成功！');
        yield put(routerRedux.push('/config/userList'));
      } else {
        message.error(result.msg);
      }
    },
    *wechatList({ payload }, { call, put }) {
      const response = yield call(wechatList, payload.params);
      if (response.code === 2000) {
        yield put({ type: 'wechatListSave', payload: { response } });
      } else {
        message.error(response.msg);
      }
    },
    *getUserRoleList({ payload }, { call, put }) {
      const response = yield call(getUserRoleList, payload.params);
      if (response.code === 2000) {
        const dateArea = response.data || [];
        yield put({ type: 'getUserRoleListSave', payload: { dateArea } });
      } else {
        message.error(response.msg);
      }
    },
    *listOrg({ payload }, { call, put }) {
      const response = yield call(listOrg, payload.params);
      if (response.code === 2000) {
        yield put({ type: 'listOrgSave', payload: { response } });
      } else {
        message.error(response.msg);
      }
    },
    *getUserlist({ payload }, { call, put }) {
      const getUserlistData = yield call(getUserlist, payload.getUserlistParams);
      if (getUserlistData.code === 2000) {
        yield put({ type: 'getUserlistSave', payload: { getUserlistData } });
      } else {
        message.error(getUserlistData.msg);
      }
    },
    *addPosition({ payload }, { call, put }) {
      const addPositionData = yield call(addPosition, payload.addPositionParams);
      if (addPositionData.code === 2000) {
        message.success('岗位添加成功！');
        const getUserlistData = yield call(getUserlist, payload.getUserlistParams);
        if (getUserlistData.code === 2000) {
          yield put({ type: 'getUserlistSave', payload: { getUserlistData } });
        } else {
          message.error(getUserlistData.msg);
        }
      } else {
        message.error(addPositionData.msg);
      }
    },
    *deletePosition({ payload }, { call, put }) {
      const deletePositionData = yield call(deletePosition, payload.deletePositionParams);
      if (deletePositionData.code === 2000) {
        message.success('岗位删除成功！');
        const getUserlistData = yield call(getUserlist, payload.getUserlistParams);
        if (getUserlistData.code === 2000) {
          yield put({ type: 'getUserlistSave', payload: { getUserlistData } });
        } else {
          message.error(getUserlistData.msg);
        }
      } else {
        message.error(deletePositionData.msg);
      }
    },
    *updateUserPositionInfo({ payload }, { call, put }) {
      const updateUserPositionInfoData = yield call(
        updateUserPositionInfo,
        payload.updateUserPositionInfoParams
      );
      if (updateUserPositionInfoData.code === 2000) {
        message.success('岗位编辑成功！');
        const getUserlistData = yield call(getUserlist, payload.getUserlistParams);
        if (getUserlistData.code === 2000) {
          yield put({ type: 'getUserlistSave', payload: { getUserlistData } });
        } else {
          message.error(getUserlistData.msg);
        }
      } else {
        message.error(updateUserPositionInfoData.msg);
      }
    },
  },

  reducers: {
    getUserlistSave(state, action) {
      return { ...state, ...action.payload };
    },

    userListSave(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
    wechatListSave(state, action) {
      return {
        ...state,
        wechatList: action.payload,
      };
    },
    getUserRoleListSave(state, action) {
      return {
        ...state,
        getUserRoleList: action.payload,
      };
    },
    listOrgSave(state, action) {
      return {
        ...state,
        listOrg: action.payload,
      };
    },
  },
};
