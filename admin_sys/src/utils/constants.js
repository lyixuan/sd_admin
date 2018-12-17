/**
 * 静态常量文件
 * */
// time
export const TIME_LOCAL = 'zh-cn';

// localstorage key
export const ADMIN_AUTH_LIST = 'admin_auth';
export const ADMIN_USER = 'admin_user';

// 前端角色类型
export const FRONT_ROLE_TYPE_LIST = [
  { id: 'college', name: '院长或副院长' },
  { id: 'family', name: '家族长' },
  { id: 'group', name: '运营长' },
  { id: 'class', name: '班主任' },
  { id: 'admin', name: '管理员' },
  { id: 'boss', name: '管理层' },
  { id: 'others', name: '无绩效岗位' },
];
// 访问权限
export const VISIT_RIGHT_LIST = [
  { id: 'scoreView', name: '学分' },
  { id: 'privilegeView', name: '绩效' },
  { id: 'endView', name: '后台' },
];

export const BOTTOM_TABLE_LIST = [{ id: '0', name: '学分底表' }, { id: '1', name: '预估分底表' }];
export const BOTTOM_TABLE_STATUS = [
  { id: '0', name: '打包中' },
  { id: '1', name: '已完成' },
  { id: '2', name: '打包错误' },
];
// 需要用于global filter 进行数据筛选的，必须加到default里
export default {
  TIME_LOCAL,
  ADMIN_AUTH_LIST,
  ADMIN_USER,
  FRONT_ROLE_TYPE_LIST,
  VISIT_RIGHT_LIST,
  BOTTOM_TABLE_LIST,
  BOTTOM_TABLE_STATUS,
};
