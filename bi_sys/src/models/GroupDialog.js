import {weekMean} from '../utils/FormatDate';
import {getQueryTrendAll} from '../services/api'

export default {
  namespace: 'groupDialogList',
  state: {
    paramsObj1: {
        userId: 123234,   //用户身份 this.props.index.groupId||
        familyType: 1,    //1自考2壁垒3孵化器
        groupType: 1,   //1:学院，2:家族，3:小组
    },
    dataObj1: null,
  },
  effects: {
    * fetch({payload}, {call, put}) {
      const paramsObj1 = payload.paramsObj1;
      const dataObj1 = yield call(getQueryTrendAll, {...paramsObj1});
      yield put({type: 'save', payload: {dataObj1, paramsObj1}});
    },
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
  },
  subscriptions: {},
};
