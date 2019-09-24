import { message } from 'antd';
import { stepsVerify, stepSubmit } from '../services/api';

export default {
  namespace: 'stepsModel',

  state: {
    stepsVerifyData: {},
    stepSubmitData: {},
  },

  effects: {
    // 申诉管理接口，批量删除申诉 第一步接口
    *stepsVerify({ payload, callback }, { call, put }) {
      const { params } = payload;
      const stepsVerifyData = yield call(stepsVerify, { ...params });
      if (stepsVerifyData.code === 20000) {
        if (!stepsVerifyData.data) {
          message.error(stepsVerifyData.msgDetail);
          return false;
        }
        yield put({ type: 'save', payload: { stepsVerifyData } });
        callback(stepsVerifyData);
        // return stepsVerifyData;
      } else {
        message.error(stepsVerifyData.msg);
        return false;
      }
      // return ;
    },
    // 申诉管理接口，批量删除申诉 第二步
    *stepSubmit({ payload }, { call, put }) {
      const { params } = payload;
      const stepSubmitData = yield call(stepSubmit, { ...params });
      if (stepSubmitData.code !== 20000) {
        message.error(stepSubmitData.msg);
        return false;
      } else {
        yield put({ type: 'save', payload: { stepSubmitData } });
        return stepSubmitData;
      }
    },
  },

  reducers: {
    save(state, action) {
      const { checkList } = action.payload;
      if (checkList) {
        const { errorList } = checkList.data;
        if (errorList) {
          errorList.forEach((item, i) => {
            errorList[i].key = i;
          });
        }
      }
      return { ...state, ...action.payload };
    },
  },
};
