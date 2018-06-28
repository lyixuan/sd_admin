import {
  getRoleList,
  getRoleAdd,
  getRoleListAll,
  getRoleDelete,
  getRoleUpdate,
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
      // let getJsonTree=function(data,parentId){
      //   let itemArr=[];
      //   for(let i=0;i<data.length;i++){
      //     let node=data[i];
      //     if(node.parentId==parentId ){
      //       let newNode={id:node.id,title:node.name,nodes:getJsonTree(data,node.parentId)};
      //       itemArr.push(newNode);
      //     }
      //   }
      //   return itemArr;
      // };
      // console.log(getJsonTree(listAll.content,''));
      /*
      * 临时取data
      * */

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
            listAll.thirChild.push(item.name);
          });
        }
      });

      return { ...state, listAll, mapIdtoName };
    },
  },
};
