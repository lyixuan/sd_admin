import {weekMean, isRequestRelative} from '../utils/FormatDate';
import {dealWithRelativeData} from '../utils/dealWithRelative';
import {getCreditRankAvgList, getCreditTrendAvgList, getCreditCompanyAvgList,getCreditTrendObjList} from '../services/api';
import {familyTypeDict} from '../utils/typeDict';


export default {
  namespace: 'home',
  state: {
    paramsObj: {
      startTime: weekMean(new Date()).startTime,  //默认周均分
      endTime: weekMean(new Date()).endTime,
      creditType: 1,    //均分类型1为学分均分2正面均分,3负面均分
      groupType: 1,     //1:学院，2:家族，3:小组
      rankType: 3,      //1:集团，2:院内，3:null
      userId: 123456,
      dataType: 1,      //1:周均,2:月均,3:自定义
    },
    fmilyTypeFilteKeyIDs:{       //选中趋势图线面的按钮
      selfExam:null,
      barrier:null,
      incubator:null,
    },
    rankDataObj: null,        //排名对象
    trendDataObj: null,       //趋势图请求数据
    companyAvgList: null,       //集团均分数据
    firstMeanObj:null,         //排名第一均分第一对象
    creditShowType: 'rank',   //均分数据展示类型,排名rank,趋势:trend

    paramsObjUpdate: {
      userId: 123456,
      filteKeyID: 104,     //1:学院，2:家族，3:小组
      BeginTime: '2018-04-19',
      EndTime: '2018-04-19',
      creditType: 1,    //均分类型1为学分均分2正面均分,3负面均分
      rankType: 3,      //1:集团，2:院内，3:null
      groupType: 1,     //1:学院，2:家族，3:小组
    },
    updataDataObj: null,
  },
  effects: {
    * fetchRank({payload}, {call, put}) {     //排名接口
      const paramsObj = payload.paramsObj;
      const creditShowType = payload.creditShowType;
      const relativeParams = isRequestRelative(paramsObj);   //环比请求参数,当时间不合法时返回null,不予请求
      const rankDataObj = yield call(getCreditRankAvgList, {...paramsObj});
      const chainData = relativeParams !== null ? yield call(getCreditRankAvgList, {...relativeParams}) : [];
      yield put({type: 'saveRank', payload: {rankDataObj, paramsObj, creditShowType, chainData}});
    },
    * fetchTrend({payload}, {call, put}) {     //趋势接口,初始化数据以及切换tab
      let trendDataObj = {};
      const paramsObj = payload.paramsObj;
      const creditShowType = payload.creditShowType;
      let rankDataObj = yield call(getCreditRankAvgList, {...paramsObj});  //根据排名接口控制趋势图接口数据
      let fmilyTypeFilteKeyIDs={};                //趋势图西面的按钮
      if (rankDataObj.data !== null) {            //排名接口有数据
        for (let item in rankDataObj.data) {
          if (rankDataObj.data[item] !== null) {   //判断数据是否有值
            const familyTypeData = rankDataObj.data[item];
            if (familyTypeData.data !== null && familyTypeData.data.length > 0) {    //判断是否有值
              const filteKeyID = familyTypeData.data[0].groupId;
              const familyType = familyTypeDict[item];
              fmilyTypeFilteKeyIDs[item]=filteKeyID||null;
              console.log(222)
              const familyTypeReaponse = yield call(getCreditTrendAvgList, {...paramsObj, filteKeyID, familyType});
              familyTypeReaponse.data !== null && (trendDataObj[item] = familyTypeReaponse.data[item])
            }
          }
        }
        const companyAvgDataObj = yield call(getCreditCompanyAvgList, {...paramsObj});    //获取集团均分数据
        yield put({
          type: 'saveTrend',
          payload: {paramsObj, creditShowType, companyAvgDataObj, trendDataObj, rankDataObj,fmilyTypeFilteKeyIDs}
        });

      } else {                                  //排名接口无数据
        rankDataObj = {};
        yield put({type: 'saveEmptyTrend', payload: {trendDataObj, rankDataObj, paramsObj, creditShowType,}});
      }
    },
    * updateTrend({payload}, {call, put}) {     //...接口
      const paramsObjupdate = payload.paramsObjupdate;
      const updataDataObj = yield call(getCreditCompanyAvgList, {...paramsObjupdate});
      yield put({type: 'saveupdateTrend', payload: {updataDataObj, paramsObjupdate}});
    },
    * getGroupList({payload}, {call, put}){
      const GroupList=yield call(getCreditTrendObjList,{...payload});

      console.log(GroupList);
      yield put({type:'saveGroupList',payload:{GroupList}})
    }
  },

  reducers: {
    saveRank(state, action) {
      const {paramsObj, creditShowType} = action.payload;
      let rankDataObj = action.payload.rankDataObj.data === null ? {} : action.payload.rankDataObj.data;
      let chainData = action.payload.chainData === null ? {} : action.payload.chainData.data;
      Object.keys(rankDataObj).forEach(function (item) {
        if (!rankDataObj[item]) {
          rankDataObj[item] = null;
        } else {
          let newChainData = chainData[item] === undefined ? [] : chainData[item].data;
          rankDataObj[item].data = dealWithRelativeData(rankDataObj[item].data, newChainData, 'groupId', 'val');
        }
      });
      return {...state, rankDataObj, paramsObj, creditShowType};
    },
    saveTrend(state, action) {
      const {paramsObj, creditShowType, trendDataObj,fmilyTypeFilteKeyIDs}=action.payload;
      const rankDataObj=action.payload.rankDataObj.data !==null?action.payload.rankDataObj.data:{};
      const companyAvgDataObj=action.payload.companyAvgDataObj.data!==null?action.payload.companyAvgDataObj.data:{};
      const firstMeanObj=JSON.parse(JSON.stringify(trendDataObj));   //复制第一数据
      //判空处理
      return {...state, trendDataObj, paramsObj, creditShowType,rankDataObj,companyAvgDataObj,firstMeanObj,fmilyTypeFilteKeyIDs};
    },
    saveEmptyTrend(state, action) {
      console.log(action.payload)
      return {...state, ...action.payload};
    },
    saveupdateTrend(state, action) {
      let {trendDataObj, paramsObj, creditShowType} = action.payload;//待处理
      return {...state, trendDataObj, paramsObj, creditShowType};
    },
    saveGroupList(state, action){
      return {...state, ...action.payload};
    }
  },
  subscriptions: {},
};
