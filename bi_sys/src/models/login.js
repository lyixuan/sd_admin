import {fakeSubmitForm} from '../services/api';

export default {

  namespace: 'login',

  state: {
    userInfo:null,
    status: undefined,
  },

  subscriptions: {},

  effects: {
    * fetch({payload}, {call, put}) {  // eslint-disable-line
      const response = yield call(fakeSubmitForm);
      if(response){
        yield put({type: 'saveUser', payload: response});
      }else{
        yield put({type: 'faildLogin', payload: response});
      }

    },
  },

  reducers: {
    saveUser(state, action) {
      console.log(action.payload)
      const userInfo=action.payload.data||null;
      return {...state, userInfo};
    },
    faildLogin(state, action){
      const userInfo=null;
      //处理请求失败,走微信授权
      return {...state, userInfo};
    }
  },

};
