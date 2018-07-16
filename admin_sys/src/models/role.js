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
      if (dataList.code !== 2000) {
        message.error(dataList.msg);
      } else {
        yield put({
          type: 'saveList',
          payload: { dataList: dataList.data },
        });
      }
    },
    *roleAdd({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const getCode = yield call(getRoleAdd, { ...paramsObj });
      if (getCode.code === 2000) {
        message.success('成功创建角色！');
        yield put(routerRedux.push('/role/roleList'));
      } else {
        message.error(getCode.msg);
      }
    },
    *roleListAll({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const listAll = yield call(getRoleListAll, { ...paramsObj });
      if (listAll.code !== 2000) {
        message.error(listAll.msg);
      } else {
        yield put({
          type: 'saveListAll',
          payload: { listAll: listAll.data },
        });
      }
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
        message.success('成功编辑角色！');
        yield put(routerRedux.push('/role/roleList'));
      } else {
        message.error(getCode.msg);
      }
    },
    *rolePrivileges({ payload }, { put, call }) {
      const { paramsIds } = payload;
      const getRoleIds = yield call(getRolePrivileges, { ...paramsIds });
      if (getRoleIds.code !== 2000) {
        message.error(getRoleIds.msg);
      } else {
        yield put({
          type: 'savePrivileges',
          payload: { getRoleIds: getRoleIds.data },
        });
      }
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
      const getRoleData = getJsonTree(getRoleIds, 0);

      const ids = [];
      getRoleIds.forEach(item => {
        if (item.checked && item.level === 3) {
          ids.push(item.id);
        }
      });
      getRoleIds = ids;
      return { ...state, getRoleIds, getRoleData };
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

      // 生成树状数据结构
      listAll = getJsonTree(content, 0);

      return { ...state, listAll, mapIdtoName };
    },
  },
};
