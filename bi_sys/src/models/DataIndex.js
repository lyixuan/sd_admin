import {weekMean} from '../utils/FormatDate';
import {getCreditDementionList,getQueryCreditTrend,getdementionTypeList} from '../services/api'

export default {
  namespace: 'dataIndex',
  state: {
    dementionId:1,
    paramsObj1: {
        //groupId: 301,   //学院id
        type: 1,    //均分类型1正面得分,2负面得分
        // startTime: 1525761508,  //默认周均分
        // endTime: weekMean(new Date()).endTime,
        // userId:1,//用户身份
		    // creditType:3,//
		    // groupType:1,//0:学院，1:家族，2:小组 
		    // rankType:null,
		    // filteKeyID:null,
		    // splitLevel:1,
		    // BeginTime:null,
		    // EndTime:null,
		    // firstId:301,
		    // trendType:null,
		    // dementionId:null,
		    // familyType:1,//1:自考，2:壁垒，3:孵化器
		    // beginTime:null
    },
    dataObj1: null,
    paramsObj2: {
        groupType: 1,   //1:学院，2:家族，3:小组
        familyType: 0,   //0:自考，1:壁垒，2:孵化器
        startTime: 1525761508,  //默认周均分
        endTime: weekMean(new Date()).endTime,
        // userId:1,//用户身份
		    // creditType:3,//
		    // rankType:null,
		    // filteKeyID:301,
		    // splitLevel:1,
		    // BeginTime:null,
		    // EndTime:null,
		    // firstId:301,
		    // groupId:301,
		    // type:1,
		    // trendType:null,
		    // dementionId:null,
		    // beginTime:null
    },
    dataObj2: null,
    paramsObj3: {
        groupType: 1,   //1:学院，2:家族，3:小组
        familyType: 0,   //0:自考，1:壁垒，2:孵化器
        startTime: 1525761508,  //默认周均分
        endTime: weekMean(new Date()).endTime,
        userId:1,//用户身份
		    creditType:3,//
		    rankType:null,
		    filteKeyID:1,
		    splitLevel:1,
		    BeginTime:null,
		    EndTime:null,
		    firstId:301,
		    groupId:301,
		    type:1,
		    trendType:null,
		    dementionId:null,
		    beginTime:null
    },
    dataObj3: null,
  },
  effects: {
    * fetch({payload}, {call, put}) {
      const paramsObj1 = payload.paramsObj1;
      //console.log(payload)
      const paramsObj2 = payload.paramsObj2;
      const paramsObj3 = payload.paramsObj3;
      const dataObj1 = yield call(getCreditDementionList, {...paramsObj1});
      const datasource =dataObj1.data
      const dementionId=datasource[0].id;
      //console.log(datasource)
      const dataObj2 = yield call(getQueryCreditTrend, {...paramsObj2,dementionId});
      const dataObj3 = yield call(getdementionTypeList, {...paramsObj3,dementionId});
      yield put({type: 'fetchsave', payload: {dataObj1,dataObj2,dataObj3, paramsObj1, paramsObj2, paramsObj3,dementionId}});
    },
    * chart({payload}, {call, put}) {
      const paramsObj2 = payload.paramsObj2;
      const dementionId=payload.dementionId;
      const dataObj2 = yield call(getQueryCreditTrend, {...paramsObj2,dementionId});
      yield put({type: 'chartsave', payload: {dataObj2, paramsObj2,dementionId}});
    },
    * table({payload}, {call, put}) {
      const paramsObj3 = payload.paramsObj3;
      const dementionId=payload.dementionId;
      const dataObj3 = yield call(getdementionTypeList, {...paramsObj3,dementionId});
      yield put({type: 'tablesave', payload: {dataObj3, paramsObj3,dementionId}});
    },
  },

  reducers: {
    fetchsave(state, action) {
      return {...state, ...action.payload};
    },
    chartsave(state, action) {
      return {...state, ...action.payload};
      },
    tablesave(state, action) {
      return {...state, ...action.payload};
    },
  },
  subscriptions: {},
};
