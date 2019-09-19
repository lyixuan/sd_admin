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
    *stepsVerify({ payload }, { call, put }) {
      //   const stepsVerifyData = {
      //     totalCount: 20,
      //     successCount: 10,
      //     failCount: 10,
      //     failList: [1, 23234, 3241],
      //   };
      const { params } = payload;
      //   console.log(stepsVerifyData, 'stepsVerifyData');
      //   yield put({ type: 'save', payload: { stepsVerifyData } });
      //   return stepsVerifyData;
      const stepsVerifyData = yield call(stepsVerify, { ...params });
      if (stepsVerifyData.code === 2000) {
        yield put({ type: 'appealListSave', payload: { stepsVerifyData } });
        return stepsVerifyData;
      } else {
        message.error(stepsVerifyData.msg);
      }
    },
    // 申诉管理接口，批量删除申诉 第二步
    *stepSubmit({ payload }, { call, put }) {
      //   const stepSubmitData = {
      //     status: false,
      //     totalCount: 98,
      //   };
      const { params } = payload;
      //   console.log(stepSubmitData, 'stepSubmitData');
      //   yield put({ type: 'save', payload: { stepSubmitData } });
      //   return stepSubmitData;
      const stepSubmitData = yield call(stepSubmit, { ...params });
      if (stepSubmitData.code !== 20000) {
        message.error(stepSubmitData.msg);
        yield put({ type: 'save', payload: { stepSubmitData } });
        return stepSubmitData;
      } else {
        yield put({ type: 'save', payload: { stepSubmitData } });
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
