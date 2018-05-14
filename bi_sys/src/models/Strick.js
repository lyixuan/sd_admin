import { getStrickFirData,getStrickSecData } from '../services/CreditDetails';
import { isRequestRelative} from '../utils/FormatDate';
import {dealWithRelativeData, dealWithRelativeData2} from '../utils/dealWithRelative';

export default {
  	namespace: 'Strick',
  	state: {
  		paramsObj: {
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
		    familyType:null,
		    beginTime:null
    	},
    	paramsObj2:{
    		userId:'',//用户身份
			groupId:'1',//学院id
			startTime:'1',//时间段
			endTime:'1',
    	},
    	dataList:null,
    	dataList_D:{
    		familySelf:[],
    		familyBarrier:[],
    		familyIncubator:[],
    		collegeSelf:[],
    		collegeBarrier:[],
    		collegeIncubator:[],
    		groupSelf:[],
    		groupBarrier:[],
    		groupIncubator:[],
    	},
    	dataSecList:null,
    	isLow:true
  	},
 	effects: {
 		*fetch({ payload}, { call, put }) { //环比
 			const paramsObj = payload.paramsObj;
	      	const relativeParams = isRequestRelative(paramsObj);   //环比请求参数,当时间不合法时返回null,不予请求
	      	const dataList = yield call(getStrickFirData, {...paramsObj});
	      	const chainData = relativeParams !== null ? yield call(getStrickFirData, {...relativeParams}) : [];
	      	yield put({type: 'getData', payload: {dataList, paramsObj, chainData}});
 			
	    },
	    *getDetail({ payload}, { call, put }){
	    	const paramsObj2 = payload.paramsObj2;
	    	const relativeParams = isRequestRelative(paramsObj2);   //环比请求参数,当时间不合法时返回null,不予请求
	      	const dataSecList  = yield call(getStrickSecData, {paramsObj2});
	      	const chainData2 = relativeParams !== null ? yield call(getStrickSecData, {...relativeParams}) : [];
	    	yield put({type: 'getData', payload: { dataSecList, paramsObj2, chainData2}});
	      	
	    },
	    *selectFn({ payload}, {  put }){

			//待解决
	    	// yield put({type: 'getData', payload: { isLow}});
	      	// console.log(dataSecList)
	    },
	    *fetchRank({payload}, {call, put}) {    
	      	const paramsObj = payload.paramsObj;
	      	const dataList  = yield call(getStrickFirData, {paramsObj});
	      	yield put({type: 'getData', payload: {dataList, paramsObj}});
	    },
  	},

  	reducers: {
	    getData(state,  action ) {

	    	let {dataList, dataSecList, paramsObj,paramsObj2, chainData,chainData2} = action.payload;
	    	if(dataList){
		    	['selfExam', 'barrier', 'incubator'].forEach(function (item) {        //自考,壁垒,孵化器,如果没有值得花默认为null
			        if (dataList[item] === undefined) {
			          	dataList[item] = null;
			        } else {
			        	if(chainData.length>0){
			        		dataList[item] = dealWithRelativeData(dataList[item], chainData[item], 'score');
			        	}
			        }
			    });
	    		// let data = dataList;

		    	// for(let i=0; i<data.barrier.length; i++){
		    	// 	if(data.barrier[i].groupType==1){
		    	// 		state.dataList_D.collegeBarrier.push(data.barrier[i]);
		    	// 	}else if(data.barrier[i].groupType==2){
		    	// 		state.dataList_D.familyBarrier.push(data[i]);
		    	// 	}else {
		    	// 		state.dataList_D.groupBarrier.push(data[i]);
		    	// 	}
		    	// }
		    	// for(let i=0; i<data.incubator.length; i++){
		    	// 	if(data.incubator[i].groupType==1){
		    	// 		state.dataList_D.collegeIncubator.push(data.incubator[i]);
		    	// 	}else if(data.incubator[i].groupType==2){
		    	// 		state.dataList_D.familyIncubator.push(data[i]);
		    	// 	}else {
		    	// 		state.dataList_D.groupIncubator.push(data[i]);
		    	// 	}
		    	// }
		    	// for(let i=0; i<data.selfExam.length; i++){
		    	// 	if(data.selfExam[i].groupType==1){
		    	// 		state.dataList_D.collegeSelf.push(data.selfExam[i]);
		    	// 	}else if(data.selfExam[i].groupType==2){
		    	// 		state.dataList_D.familySelf.push(data[i]);
		    	// 	}else {
		    	// 		state.dataList_D.groupSelf.push(data[i]);
		    	// 	}
		    	// }
	    	}
	    	if(dataSecList){
	    		['items'].forEach(function (item,i) {        //自考,壁垒,孵化器,如果没有值得花默认为null
	    			console.log(item,i)
			        if (dataSecList[item] === undefined) {
			          dataSecList[item] = null;
			        } else {
			        	if(chainData2.length>0){
					        dataSecList[item] = dealWithRelativeData(dataSecList[item], chainData2[item], 'negative');
					        dataSecList[item] = dealWithRelativeData2(dataSecList[item], chainData2[item], 'positive');
					    }
			        }
			    });
	    	}
	      	return {...state, ...action.payload};
	     },
  	},
  	subscriptions: {

  	},
};
