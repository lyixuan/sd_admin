const userTypeData = {
  college: '院长或副院长',
  family: '家族长',
  group: '运营长',
  class: '班主任',
  admin: '管理员',
  boss: '管理层',
  others: '无绩效岗位',
  csmanager: '客诉经理',
  cssupervisor: '客诉主管',
  csleader: '客诉组长',
  csofficer: '客诉专员',
};

const userTypeDataReset = {
  院长或副院长: 'college',
  家族长: 'family',
  运营长: 'group',
  班主任: 'class',
  管理员: 'admin',
  管理层: 'boss',
  无绩效岗位: 'others',
  客诉经理: 'csmanager',
  客诉主管: 'cssupervisor',
  客诉组长: 'csleader',
  客诉专员: 'csofficer',
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
  优新随堂考: 2,
  IM未回复: 3,
  IM不及时: 4,
  IM不满意: 5,
  工单24: 6,
  工单48: 7,
  工单72: 8,
};
const appealTypeRest = {
  1: '优新减分-开班电话',
  2: '优新减分-随堂考',
  3: 'IM减分-未回复',
  4: 'IM减分-不及时',
  5: 'IM减分-不满意',
  6: '工单初次减分',
  7: '工单二次减分',
  8: '工单三次减分',
};

// 绩效包家族小组类型
const performanceType = {
  1: '人均在服学院排名比（自考）',
  2: '人均在服学院排名比（壁垒）',
  3: '管理规模',
  4: '日均学分排名比（自考）',
  5: '日均学分排名比（壁垒）',
  6: '人均在服学院排名比',
  7: '日均学分排名比',
  8: '绩效比例',
};
export {
  appealTypeRest,
  appealType,
  userTypeData,
  userTypeDataReset,
  levelData,
  levelDataReset,
  isUpdateDataReset,
  performanceType,
};
