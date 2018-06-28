import { message} from 'antd';
import {
  getRoleListAll,
  addPermission,
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
  },

  effects: {
    *permissionList({ payload }, { call, put }) {
      const response = yield call(getRoleListAll, payload.permissionListParams);
      console.log(response)
      yield put({ type: 'permissionListSave', payload: { response } });
    },
    *addPermission({ payload }, { call, put }) {
      yield call(addPermission, payload.addPermissionParams);
      const response = yield call(getRoleListAll, {});
      console.log(response)
      yield put({ type: 'permissionListSave', payload: { response } });
    },
    *updatePermission({ payload }, { call, put }) {
      yield call(updatePermission, payload.updatePermissionParams);
      const response = yield call(getRoleListAll, {});
      console.log(response)
      yield put({ type: 'permissionListSave', payload: { response } });
    },
    *permissionListAllName({ payload }, { call, put }) {
      const response = yield call(permissionListAllName, payload.permissionListAllNameParams);
      yield put({
        type: 'permissionListAllNameSave',
        payload: response,
      });
    },
  },

  reducers: {
    permissionListSave(state, action) {
      return {
        ...state,
        permissionList: action.payload,
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
