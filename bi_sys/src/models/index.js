import {getOrgMap} from '../services/api';
import {getItem} from '../utils/localStorage'
import {routerRedux} from 'dva/router';

export default {
  namespace: 'index',
  state: {
    organization: {
      selfExam: [],
      barrier: [],
      incubator: [],
    },
    userInfo: null,
  },

  subscriptions: {
    setup({dispatch, history}) {  // eslint-disable-line
      const userInfo = getItem();      //判断数据是否有值
      //待解决
      userInfo === null && history.push('/login');     //待定,应当跳到登录页面
    },
  },

  effects: {
    * fetch({payload}, {call, put}) {  // eslint-disable-line
      const userInfo = yield getItem() || null;
      const response = yield call(getOrgMap);


      //待解决
      userInfo === null ? yield put(routerRedux.push('/login')) : yield put({type: 'save', payload: {userInfo, response}});
    },
  },
  reducers: {
    save(state, action) {
      const organization = state.organization;
      const {userInfo, response} = action.payload;
      let groupid = userInfo.groupId;
      let groupType = userInfo.groupType;
      //groupType值为1学院2家族3自考
      for (let i = 0, len = response.data.length; i < len; i++) {
        let item = response.data[i];
        if (item[groupType + 'Id'] === groupid) {
          let familyTypeNum = item['familyType'];
          let {collegeId, collegeName, familyId, familyName, familyType, groupId, groupName} = item;
          let obj = {collegeId, collegeName, familyId, familyName, familyType, groupId, groupName};
          familyTypeNum === 0 && organization['selfExam'].push(obj);
          familyTypeNum === 1 && organization['barrier'].push(obj);
          familyTypeNum === 2 && organization['incubator'].push(obj);
        }

      }
      return {...state, organization, userInfo};
    },
  },

};
