const userTypeData = {
  college: '学院',
  family: '家族',
  group: '小组',
  admin: '系统管理员',
  boss: '高级管理员',
  class: '无底表权限',
};

const userTypeDataReset = {
  学院: 'college',
  家族: 'family',
  小组: 'group',
  系统管理员: 'admin',
  高级管理员: 'boss',
  无底表权限: 'class',
};

const levelData = {
  3: '页面功能',
  2: '二级页面',
  1: '一级页面',
};

const levelDataReset = {
  页面功能: 3,
  二级页面: 2,
  一级页面: 1,
};

const isUpdateDataReset = {
  全部: 0,
  是: 1,
  否: 2,
};

const appealType = {
  全部: 0,
  优新开班电话: 1,
  犹新随堂考: 2,
  IM未回复: 3,
  IM不及时: 4,
  IM不满意: 5,
  工单24: 6,
  工单48: 7,
  工单72: 8,
};
const appealTypeRest = {
  1:'优新减分-开班电话',
  2:'优新减分-随堂考',
  3: 'IM减分-未回复',
  4: 'IM减分-不及时',
  5: 'IM减分-不满意',
  6: '工单初次减分',
  7: '工单二次减分',
  8: '工单三次减分',
};

export {
  appealTypeRest,
  appealType,
  userTypeData,
  userTypeDataReset,
  levelData,
  levelDataReset,
  isUpdateDataReset,
};
