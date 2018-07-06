import { message } from 'antd';
import {
  getCollegeList,
  updateCollege,
  getFamilyList,
  updateFamily,
  getGroupList,
  updateGroup,
} from '../services/api';

export default {
  namespace: 'shortName',

  state: { visible: false },

  effects: {
    *collegeList({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const collegeList = yield call(getCollegeList, { ...paramsObj });
      yield put({
        type: 'save',
        payload: { dataList: collegeList },
      });
    },
    *editCollege({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const getCode = yield call(updateCollege, { ...paramsObj });
      if (getCode.code === 2000) {
        message.success('短名称修改成功！');
        const collegeList = yield call(getCollegeList, {});
        yield put({
          type: 'save',
          payload: { dataList: collegeList, visible: false },
        });
      } else {
        message.error(getCode.msg);
      }
    },
    *familyList({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const familyList = yield call(getFamilyList, { ...paramsObj });
      yield put({
        type: 'save',
        payload: { dataList: familyList },
      });
    },
    *editFamily({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const getCode = yield call(updateFamily, { ...paramsObj });
      if (getCode.code === 2000) {
        message.success('短名称修改成功！');
        const familyList = yield call(getFamilyList, {});
        yield put({
          type: 'save',
          payload: { dataList: familyList, visible: false },
        });
      } else {
        message.error(getCode.msg);
      }
    },
    *groupList({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const groupList = yield call(getGroupList, { ...paramsObj });
      yield put({
        type: 'save',
        payload: { dataList: groupList },
      });
    },
    *editGroup({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const getCode = yield call(updateGroup, { ...paramsObj });
      if (getCode.code === 2000) {
        message.success('短名称修改成功！');
        const groupList = yield call(getGroupList, {});
        yield put({
          type: 'save',
          payload: { dataList: groupList, visible: false },
        });
      } else {
        message.error(getCode.msg);
      }
    },
  },

  reducers: {
    save(state, action) {
      const { dataList } = action.payload;
      const { data } = dataList;
      data.forEach((item, i) => {
        data[i].key = i;
      });
      return { ...state, ...action.payload };
    },
    saveList(state, action) {
      const { dataList } = action.payload;
      const { content } = dataList;
      content.forEach((item, i) => {
        content[i].key = i;
      });
      return { ...state, dataList };
    },
  },
};
