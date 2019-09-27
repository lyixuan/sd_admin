import { message } from 'antd';
import {
  incomeOrderList,
  getDateRange,
  // importCheck,
  // importUpload,
  // deleteCheck,
  // deleteReview,
  // deleteRecommend,
  createIncomeCheck,
  createIncomeData,
  getOrgMapList,
  incomeEditSave,
  getNameByMail,
} from '../services/api';

export default {
  namespace: 'createIncome',

  state: {
    nums: '',
    current: 0,
    disableDel: null, // 根据接口返回决定是否禁止下一步按钮：true--禁止
    qualityList: [],
    fileList: [],
    isLoading: null,
    endDate: undefined,
    beginDate: undefined,
  },

  effects: {
    *getOrgMapList({ payload }, { call, put }) {
      const { params } = payload;
      const result = yield call(getOrgMapList, params);
      const orgList = result.data || [];

      if (result.code === 20000) {
        yield put({ type: 'saveMap', payload: { orgList } });
      } else {
        message.error(result.msg);
      }
    },
    *incomeEditSave({ payload }, { call }) {
      const { params } = payload;
      const result = yield call(incomeEditSave, params);
      if (result.code === 20000 && result.data) {
        message.success('保存成功');
        return true;
      } else {
        message.error(result.msgDetail);
        return false;
      }
    },
    *getNameByMail({ payload }, { call, put }) {
      const { params } = payload;
      const response = yield call(getNameByMail, params);
      if (response.code === 20000) {
        yield put({ type: 'saveTime', payload: { mailName: response.data } });
      }
    },
    *saveMail({ payload }, { put }) {
      const { params } = payload;
      yield put({ type: 'saveTime', payload: { mailName: params.mailName } });
    },
    *recommendList({ payload }, { call, put }) {
      const { getListParams } = payload;
      const page = getListParams.pageNum + 1;
      delete getListParams.pageNum;
      const response = yield call(incomeOrderList, { ...getListParams, ...{ page } });
      yield put({
        type: 'pureSave',
        payload: { response, getListParams: { ...getListParams, ...{ page } } },
      });
    },
    *getDateRange(_, { call, put }) {
      const response = yield call(getDateRange);
      if (response.code === 20000) {
        yield put({
          type: 'saveTime',
          payload: {
            endDate: response.data && response.data.endDate,
            beginDate: response.data && response.data.beginDate,
          },
        });
        return response.data;
      } else {
        message.error(response.msg);
      }
    },
    *createIncomeCheck({ payload }, { call, put }) {
      const logMsg = [];
      const checkList = yield call(createIncomeCheck, { ...payload });
      if (checkList.code !== 20000) {
        if (checkList.data.failList) {
          checkList.data.failList.forEach(item => {
            logMsg.push(item.log);
          });
          message.error(logMsg.join(','));
        } else {
          message.error(checkList.msg);
        }
        yield put({ type: 'save', payload: { current: 0, isLoading: false } });
      } else if (checkList.data.failList.length > 0) {
        yield put({
          type: 'save',
          payload: { checkList, current: 1, disableDel: true, isLoading: false },
        });
      } else {
        yield put({
          type: 'save',
          payload: { checkList, current: 1, disableDel: false, isLoading: false },
        });
      }
    },
    *createIncomeData({ payload }, { call, put }) {
      const excelData = yield call(createIncomeData, { ...payload });
      if (excelData.code !== 20000) {
        message.error(excelData.msg);
        yield put({ type: 'save', payload: { current: 1, isLoading: false } });
      } else {
        yield put({ type: 'save', payload: { current: 2, isLoading: false } });
      }
    },
    // *deleteCheck({ payload }, { call, put }) {
    //   const { params } = payload;
    //   const preDelData = yield call(deleteCheck, { ...params });

    //   if (preDelData.code !== 2000) {
    //     message.error(preDelData.msg);
    //     yield put({ type: 'save', payload: { current: 0, isLoading: false } });
    //   } else if (preDelData.data.successCount > 0) {
    //     yield put({
    //       type: 'save',
    //       payload: { preDelData, current: 1, disableDel: false, isLoading: false },
    //     });
    //   } else {
    //     yield put({
    //       type: 'save',
    //       payload: { preDelData, current: 1, disableDel: true, isLoading: false },
    //     });
    //   }
    // },
    // *deleteReview({ payload }, { call, put }) {
    //   const delData = yield call(deleteReview, { ...payload });
    //   if (delData.code !== 2000) {
    //     message.error(delData.msg);
    //     yield put({ type: 'save', payload: { current: 1, isLoading: false } });
    //   } else {
    //     yield put({
    //       type: 'save',
    //       payload: { delData: delData.data, current: 2, isLoading: false },
    //     });
    //   }
    // },
    // *deleteRecommend({ payload }, { call, put }) {
    //   const delSucessData = yield call(deleteRecommend, { ...payload });
    //   if (delSucessData.code !== 2000) {
    //     message.error(delSucessData.msg);
    //     yield put({ type: 'save', payload: { current: 2, isLoading: false } });
    //   } else {
    //     yield put({
    //       type: 'save',
    //       payload: { delSucessData: delSucessData.data, current: 3, isLoading: false },
    //     });
    //   }
    // },
    *getNums({ payload }, { put }) {
      const { nums } = payload;
      yield put({ type: 'save', payload: { nums } });
    },
    *saveFileList({ payload }, { put }) {
      const { fileList } = payload;
      yield put({ type: 'save', payload: { fileList } });
    },
    *editCurrent({ payload }, { put }) {
      const { current } = payload;
      yield put({ type: 'save', payload: { current, isLoading: false } });
    },
    *editLoading({ payload }, { put }) {
      const { isLoading } = payload;
      yield put({ type: 'save', payload: { isLoading } });
    },
    *initParams({ payload }, { put }) {
      const { disableDel, nums } = payload;
      yield put({ type: 'save', payload: { disableDel, nums } });
    },
  },

  reducers: {
    save(state, action) {
      const { checkList } = action.payload;
      if (checkList) {
        const { failList } = checkList.data;
        if (failList) {
          failList.forEach((item, i) => {
            failList[i].key = i;
          });
        }
      }
      return { ...state, ...action.payload };
    },
    saveTime(state, { payload }) {
      return { ...state, ...payload };
    },
    pureSave(state, action) {
      return {
        ...state,
        qualityList: action.payload,
      };
    },
    saveMap(state, { payload }) {
      const orgListTreeData = toTreeData(payload.orgList);
      return { ...state, orgList: payload.orgList, orgListTreeData };
    },
  },
};

function toTreeData(orgList) {
  const treeData = [];
  orgList.forEach(v => {
    const o = { title: v.name, value: `a-${v.id}`, key: v.id, lv: 1 };
    if (v.nodeList.length > 0) {
      o.children = [];
      v.nodeList.forEach(v1 => {
        const o1 = { title: v1.name, value: `b-${v1.id}`, key: v1.id + 1000, lv: 2 };
        o.children.push(o1);
        if (v1.nodeList.length > 0) {
          o1.children = [];
          v1.nodeList.forEach(v2 => {
            const o2 = { title: v2.name, value: `c-${v2.id}`, key: v2.id + 100000, lv: 3 };
            o1.children.push(o2);
          });
        }
      });
    }
    treeData.push(o);
  });
  return treeData;
}
