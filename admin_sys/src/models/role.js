import {
  getRoleList,
  getRoleAdd,
  getRoleListAll,
  getRoleDelete,
  getRoleUpdate,
} from '../services/api';

export default {
  namespace: 'role',

  state: {
    dataList: [],
    params: [],
  },

  effects: {
    *roleList({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const dataList = yield call(getRoleList, { ...paramsObj });
      yield put({
        type: 'save',
        payload: { dataList: dataList.data },
      });
    },
    *roleAdd({ payload }, { call }) {
      const { paramsObj } = payload;
      yield call(getRoleAdd, { ...paramsObj });
    },
    *roleListAll({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const listAll = yield call(getRoleListAll, { ...paramsObj });
      console.log(listAll);
      yield put({
        type: 'save',
        payload: { listAll: listAll.data },
      });
    },
    *roleDelete({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const deleteData = yield call(getRoleDelete, { ...paramsObj });
      console.log(deleteData);
      yield put({
        type: 'save',
        payload: deleteData,
      });
    },
    *roleUpdate({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const updateData = yield call(getRoleUpdate, { ...paramsObj });
      console.log(updateData);
      yield put({
        type: 'save',
        payload: updateData,
      });
    },
  },

  reducers: {
    save(state, action) {
      const { dataList } = action.payload;
      const { content } = dataList;
      content.forEach((item, i) => {
        content[i].key = i;
      });
      return { ...state, ...action.payload };
    },
  },
};
