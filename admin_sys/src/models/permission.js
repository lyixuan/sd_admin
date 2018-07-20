import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  roleList,
  addPermission,
  getPermissionById,
  updatePermission,
  permissionListAllName,
} from '../services/api';

export default {
  namespace: 'permission',

  state: {
    // 请求接口上送参数

    // 接口返回数据存储
    permissionList: [],
    permissionListAllNameSave: [],
    permissionById: [],
  },

  effects: {
    *permissionList({ payload }, { call, put }) {
      const response = yield call(roleList, payload.permissionListParams);
      if (response.code === 2000) {
        yield put({ type: 'permissionListSave', payload: { response } });
      } else {
        message.error(response.msg);
      }
    },
    *permissionById({ payload }, { call, put }) {
      const response = yield call(getPermissionById, payload.permissionByIdParams);
      if (response.code === 2000) {
        yield put({ type: 'permissionByIdSave', payload: { response } });
      } else {
        message.error(response.msg);
      }
    },
    *addPermission({ payload }, { call, put }) {
      const result = yield call(addPermission, payload.addPermissionParams);
      if (result.code === 0 || result.code === 2000) {
        message.success('成功创建权限！');
        yield put(routerRedux.push('/config/permissionList'));
      } else {
        message.error(result.msg);
      }
    },
    *updatePermission({ payload }, { call, put }) {
      const result = yield call(updatePermission, payload.updatePermissionParams);
      if (result.code === 0 || result.code === 2000) {
        message.success('成功编辑权限！');
        yield put(routerRedux.goBack());
      } else {
        message.error(result.msg);
      }
    },
    *permissionListAllName({ payload }, { call, put }) {
      const response = yield call(permissionListAllName, payload.permissionListAllNameParams);
      if (response.code === 2000) {
        yield put({
          type: 'permissionListAllNameSave',
          payload: response,
        });
      } else {
        message.error(response.msg);
      }

    },
  },

  reducers: {
    permissionListSave(state, action) {
      return {
        ...state,
        permissionList: action.payload,
      };
    },
    permissionByIdSave(state, action) {
      return {
        ...state,
        permissionById: action.payload,
      };
    },
    permissionListAllNameSave(state, action) {
      return {
        ...state,
        permissionListAllName: action.payload,
      };
    },
  },
};
