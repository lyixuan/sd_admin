import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  getRoleList,
  getRoleAdd,
  getRoleListAll,
  getRoleDelete,
  getRoleUpdate,
  getRolePrivileges,
} from '../services/api';
import { getJsonTree } from '../utils/utils';

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
    *roleAdd({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const getCode = yield call(getRoleAdd, { ...paramsObj });
      if (getCode.code === 2000) {
        message.success('角色创建成功！');
        yield put(routerRedux.push('/role/roleList'));
      } else {
        message.error(getCode.msg);
      }
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
    *roleUpdate({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const getCode = yield call(getRoleUpdate, { ...paramsObj });
      if (getCode.code === 2000) {
        message.success('角色创建成功！');
        yield put(routerRedux.push('/role/roleList'));
      } else {
        message.error(getCode.msg);
      }
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

      listAll = getJsonTree(kkk, 1);
      return { ...state, listAll, mapIdtoName };
    },
  },
};
