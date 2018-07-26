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

export { userTypeData, userTypeDataReset, levelData, levelDataReset, isUpdateDataReset };
