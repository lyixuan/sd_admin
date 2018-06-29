import {
  getRoleList,
  getRoleAdd,
  getRoleListAll,
  getRoleDelete,
  getRoleUpdate,
  getRolePrivileges,
} from '../services/api';

export default {
  namespace: 'role',

  state: {},

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
    *rolePrivileges({ payload }, { put, call }) {
      const { paramsIds } = payload;
      const getRoleIds = yield call(getRolePrivileges, { ...paramsIds });
      yield put({
        type: 'savePrivileges',
        payload: { getRoleIds: getRoleIds.data },
      });
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
      return { ...state, dataList };
    },
    savePrivileges(state, action) {
      let { getRoleIds } = action.payload;
      const ids = [];
      getRoleIds.forEach(item => {
        ids.push(item.id);
      });
      getRoleIds = ids;
      return { ...state, getRoleIds };
    },
    saveListAll(state, action) {
      let { listAll } = action.payload;
      /*
      * 生成map表
      * */
      const { content } = listAll;
      const mapIdtoName = {};
      Object.keys(content).map(key => {
        mapIdtoName[content[key].name] = content[key].id;
        return mapIdtoName;
      });
      /*
       * 生成树状数据结构
       * */
      const kkk = [
        {
          id: 6,
          level: 2,
          modifyTime: 1530179572000,
          name: '首页B',
          parentId: 0,
        },
        {
          id: 1,
          level: 2,
          modifyTime: 1530179572000,
          name: '首页A',
          parentId: 0,
        },
        {
          id: 2,
          level: 2,
          modifyTime: 1530179572000,
          name: '首页1',
          parentId: 1,
        },
        {
          id: 3,
          level: 2,
          modifyTime: 1530179572000,
          name: '首2页',
          parentId: 1,
        },
        {
          id: 8,
          level: 2,
          modifyTime: 1530179572000,
          name: '首页2-2',
          parentId: 3,
        },
        {
          id: 4,
          level: 2,
          modifyTime: 1530179572000,
          name: '首页2-1',
          parentId: 3,
        },
        {
          id: 5,
          level: 2,
          modifyTime: 1530179572000,
          name: '首页1-1',
          parentId: 2,
        },
      ];
      const getJsonTree = function(data, parentId) {
        const itemArr = [];
        for (let i = 0; i < data.length; i += 1) {
          const node = data[i];
          if (node.parentId === Number(parentId)) {
            const newNode = {
              id: node.id,
              name: node.name,
              checkAll: `checkAll${i}`,
              checkedList: `checkedList${i}`,
              nodes: getJsonTree(data, node.id),
            };
            itemArr.push(newNode);
          }
        }
        return itemArr;
      };

      listAll = getJsonTree(kkk, '');

      return { ...state, listAll, mapIdtoName };
    },
  },
};
