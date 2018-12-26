/**
 * 静态常量文件
 * */
// time
export const TIME_LOCAL = 'zh-cn';

// localstorage key
export const ADMIN_AUTH_LIST = 'admin_auth';
export const ADMIN_USER = 'admin_user';

// Component setting
export const TABLE_PAGES_NUM = 30;
// Global Header Select
export const GLOBAL_HEADER_SELECT = [
  { id: 'changeRole', name: '切换角色', icon: 'user' },
  { id: 'changePwd', name: '修改密码', icon: 'lock' },
  { id: 'logout', name: '退出登录', icon: 'logout' },
];

// 前端角色类型,level含义是组织结构的层级，1代表选择到学院，2表示选择学院+家族，3代表选择三级，0代表不可选择,isPerformance代表绩效权限
export const FRONT_ROLE_TYPE_LIST = [
  { id: 'college', name: '院长或副院长', level: '1', isPerformance: 1 },
  { id: 'family', name: '家族长', level: '2', isPerformance: 1 },
  { id: 'group', name: '运营长', level: '3', isPerformance: 1 },
  { id: 'class', name: '班主任', level: '3', isPerformance: 1 },
  { id: 'admin', name: '管理员', level: '0', isPerformance: 1 },
  { id: 'boss', name: '管理层', level: '0', isPerformance: 1 },
  { id: 'others', name: '无绩效岗位', level: '0', isPerformance: 0 },
  { id: 'csmanager', name: '客诉经理', level: '1', isPerformance: 0 },
  { id: 'cssupervisor', name: '客诉主管', level: '1', isPerformance: 0 },
  { id: 'csleader', name: '客诉组长', level: '1', isPerformance: 0 },
  { id: 'csofficer', name: '客诉专员', level: '1', isPerformance: 0 },
];
// 访问权限
export const VISIT_RIGHT_LIST = [
  { id: 'scoreView', name: '学分' },
  { id: 'privilegeView', name: '绩效' },
  { id: 'endView', name: '后台' },
];
// 数据分析师id
export const DATA_ANALYST_ID = '122';
export const BOTTOM_TABLE_LIST = [
  { id: '', name: '全部' },
  { id: '0', name: '学分底表' },
  { id: '1', name: '预估分底表' },
];
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
  DATA_ANALYST_ID,
  TABLE_PAGES_NUM,
  BOTTOM_TABLE_LIST,
  BOTTOM_TABLE_STATUS,
  GLOBAL_HEADER_SELECT,
};
