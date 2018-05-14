import { firstCreditList,secCreditList } from '../services/CreditDetails';
import { isRequestRelative} from '../utils/FormatDate';
import {dealWithRelativeData} from '../utils/dealWithRelative';

export default {
  	namespace: 'CreditDetails',
  	state: {
  		paramsObj: {
  			userId:1,//用户身份
		    creditType:3,//
		    groupType:1,//1:学院，2:家族，3:小组 //1:周均数据，2:月均数据，3:自定义数据
		    rankType:null,
		    filteKeyID:null,
		    splitLevel:1,
		    startTime:"2018-04-29",
		    endTime:"2018-05-02",
		    BeginTime:null,
		    EndTime:null,
		    firstId:301,
		    groupId:301,
		    type:1,
		    trendType:null,
		    dementionId:null,
		    familyType:1,//1:自考，2:壁垒，3:孵化器
		    beginTime:null
    	},
    	paramsObj2:{
    		 userId:1,//用户身份
		    creditType:2,
		    groupType:1,//1:学院，2:家族，3:小组
		    rankType:null,
		    filteKeyID:null,
		    splitLevel:1,
		    startTime:"2018-04-29",
		    endTime:"2018-05-02",
		    BeginTime:null,
		    EndTime:null,
		    firstId:301,
		    groupId:301,
		    type:1,
		    trendType:null,
		    dementionId:null,
		    familyType:null,//1:自考，2:壁垒，3:孵化器
		    beginTime:null
    	},
	    highGroupId:[],//high data todo
    	dataList:null,
    	dataSecList:null
  	},
 	effects: {
 		*fetch({ payload}, { call, put }) {
 			const paramsObj = payload.paramsObj;
      		const relativeParams = isRequestRelative(paramsObj);   //环比请求参数,当时间不合法时返回null,不予请求
      		const dataList = yield call(firstCreditList, {...paramsObj});
      		const chainData = relativeParams !== null ? yield call(firstCreditList, {...relativeParams}) : [];
	      	yield put({type: 'getData', payload: {dataList, paramsObj, chainData}});
	    },
	    *getDetail({ payload}, { call, put }){
	    	const paramsObj2 = payload.paramsObj2;
	    	const relativeParams = isRequestRelative(paramsObj2);   //环比请求参数,当时间不合法时返回null,不予请求
      		const dataSecList = yield call(secCreditList, {...paramsObj2});
      		const chainData2 = relativeParams !== null ? yield call(secCreditList, {...relativeParams}) : [];
	    	yield put({type: 'getData', payload: { dataSecList, paramsObj2, chainData2}});
	    },
	    *getHighData({ payload}, { put }){
	    	const highGroupId = payload.highGroupId;
	    	yield put({type: 'getData', payload: { highGroupId}});
	    }
  	},

  	reducers: {
	    getData(state,  action ) {
	    	let {dataList,dataSecList, paramsObj,paramsObj2, chainData,chainData2} = action.payload;
	    	if(dataList != null){
	    		['selfExam', 'barrier', 'incubator'].forEach(function (item) {        //自考,壁垒,孵化器,如果没有值得花默认为null
			        if (dataList[item] === undefined) {
			          	dataList[item] = null;
			        } else {
			        	//todo 处理时间选择不规范的情况
			          dataList[item].data = dealWithRelativeData(dataList[item].data, chainData[item].data, 'creditScore');
			        }
			    });
	    	}
	    	if(dataSecList != null){
	    		if (dataSecList === undefined) {
		          	dataSecList = null;
		        } else {
		        	//todo 处理时间选择不规范的情况
		        	console.log(chainData2)
		          	dataSecList = dealWithRelativeData(dataSecList, chainData2, 'number');
		          	dataSecList.forEach(function (item,i) {        //自考,壁垒,孵化器,如果没有值得花默认为null
		          		if (dataSecList[i].data === undefined) {
				          	dataSecList[i].data = null;
				        } else {
				        	//todo 处理时间选择不规范的情况
				          	dataSecList[i].data = dealWithRelativeData(dataSecList[i].data, chainData2[i].data, 'number');
				          	dataSecList[i].data.forEach(function (item1,i1) {        //自考,壁垒,孵化器,如果没有值得花默认为null
				          		if (dataSecList[i].data[i1].data === undefined) {
						          	dataSecList[i].data[i1].data = null;
						        } else {
						        	//todo 处理时间选择不规范的情况
						          	dataSecList[i].data[i1].data = dealWithRelativeData(dataSecList[i].data[i1].data, chainData2[i].data[i1].data, 'number');
						         }
					    	});
				         }
			    	});
		        }
	    		
	    	}
	      	return {...state, ...action.payload};
	     },
  	},
  	subscriptions: {

  	},
};
