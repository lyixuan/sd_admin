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
      if (collegeList.code !== 2000) {
        message.error(collegeList.msg);
      } else {
        yield put({
          type: 'save',
          payload: { collegeList },
        });
      }
    },
    *editCollege({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const getCode = yield call(updateCollege, { ...paramsObj });
      if (getCode.code === 2000) {
        message.success('短名称修改成功！');
        const collegeList = yield call(getCollegeList, {});
        yield put({
          type: 'save',
          payload: { collegeList, visible: false },
        });
        return getCode;
      } else {
        message.error(getCode.msg);
        return getCode;
      }
    },
    *familyList({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const familyList = yield call(getFamilyList, { ...paramsObj });
      if (familyList.code !== 2000) {
        message.error(familyList.msg);
      } else {
        yield put({
          type: 'save',
          payload: { familyList },
        });
      }
    },
    *editFamily({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const getCode = yield call(updateFamily, { ...paramsObj });
      if (getCode.code === 2000) {
        message.success('短名称修改成功！');
        const familyList = yield call(getFamilyList, {});
        yield put({
          type: 'save',
          payload: { familyList, visible: false },
        });
        return getCode;
      } else {
        message.error(getCode.msg);
        return getCode;
      }
    },
    *groupList({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const groupList = yield call(getGroupList, { ...paramsObj });
      if (groupList.code !== 2000) {
        message.error(groupList.msg);
      } else {
        yield put({
          type: 'save',
          payload: { groupList },
        });
      }
    },
    *editGroup({ payload }, { put, call }) {
      const { paramsObj } = payload;
      const getCode = yield call(updateGroup, { ...paramsObj });
      if (getCode.code === 2000) {
        message.success('短名称修改成功！');
        const groupList = yield call(getGroupList, {});
        yield put({
          type: 'save',
          payload: { groupList, visible: false },
        });
        return getCode;
      } else {
        message.error(getCode.msg);
        return getCode;
      }
    },
  },

  reducers: {
    save(state, action) {
      const { collegeList, familyList, groupList } = action.payload;

      // 给列表数据添加key
      if (collegeList) {
        collegeList.data.forEach((item, i) => {
          collegeList.data[i].key = i;
        });
      } else if (familyList) {
        familyList.data.forEach((item, i) => {
          familyList.data[i].key = i;
        });
      } else if (groupList) {
        groupList.data.forEach((item, i) => {
          groupList.data[i].key = i;
        });
      }

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
