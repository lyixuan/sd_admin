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
    listAll: [],
    params: [],
  },

  effects: {
    *roleList({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const dataList = yield call(getRoleList, { ...paramsObj });
      yield put({
        type: 'saveList',
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
      yield put({
        type: 'saveListAll',
        payload: { listAll: listAll.data },
      });
    },
    *roleDelete({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const deleteData = yield call(getRoleDelete, { ...paramsObj });
      yield put({
        type: 'save',
        payload: deleteData,
      });
    },
    *roleUpdate({ payload }, { call }) {
      const { paramsObj } = payload;
      yield call(getRoleUpdate, { ...paramsObj });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveList(state, action) {
      const { dataList } = action.payload;
      const { content } = dataList;
      content.forEach((item, i) => {
        content[i].key = i;
      });
      return { ...state, ...action.payload };
    },
    saveListAll(state, action) {
      let { listAll } = action.payload;
      listAll = { ...listAll, firstChild: [], secChild: [], thirChild: [] };

      Object.keys(listAll).forEach(itemList => {
        if (itemList === 'content') {
          listAll[itemList].forEach(item => {
            if (item.level === 0) {
              listAll.firstChild.push(item);
            } else if (item.level === 1) {
              listAll.secChild.push(item);
            } else if (item.level === 2) {
              listAll.thirChild.push(item);
            }
          });
        }
      });

      return { ...state, ...action.payload };
    },
  },
};
