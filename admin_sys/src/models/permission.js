import { permissionList, addPermission, updatePermission } from '../services/api';

export default {
  namespace: 'permission',

  state: {
    // 请求接口上送参数

    // 接口返回数据存储
    permissionList: [],
    addPermission: [],
    updatePermission: [],
  },

  effects: {
    *permissionList({ payload }, { call, put }) {
      const response1 = yield call(permissionList, payload.permissionListParams);
      const response = response1.data;
      yield put({ type: 'permissionListSave', payload: { response } });
    },
    *addPermission({ payload }, { call, put }) {
      const response1 = yield call(addPermission, payload.addPermissionParams);
      const response = response1.data;
      yield put({
        type: 'addPermissionSave',
        payload: response,
      });
    },
    *updatePermission({ payload }, { call, put }) {
      const response1 = yield call(updatePermission, payload.updatePermissionParams);
      const response = response1.data;
      yield put({
        type: 'updatePermissionSave',
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
    addPermissionSave(state, action) {
      return {
        ...state,
        addPermission: action.payload,
      };
    },
    updatePermissionSave(state, action) {
      return {
        ...state,
        updatePermission: action.payload,
      };
    },
  },
};
