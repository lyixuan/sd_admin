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

// 前端角色类型,level含义是组织结构的层级，1代表选择到学院，2表示选择学院+家族，3代表选择三级，0代表不可选择
export const FRONT_ROLE_TYPE_LIST = [
  { id: 'college', name: '院长或副院长', level: '1' },
  { id: 'family', name: '家族长', level: '2' },
  { id: 'group', name: '运营长', level: '3' },
  { id: 'class', name: '班主任', level: '3' },
  { id: 'admin', name: '管理员', level: '0' },
  { id: 'boss', name: '管理层', level: '0' },
  { id: 'others', name: '无绩效岗位', level: '0' },
  { id: 'csmanager', name: '客诉经理', level: '1' },
  { id: 'cssupervisor', name: '客诉主管', level: '1' },
  { id: 'csleader', name: '客诉组长', level: '1' },
  { id: 'csofficer', name: '客诉专员', level: '1' },
];
// 岗位状态
export const JOB_STATUS = [
  { id: '', name: '全部' },
  { id: '0', name: '在岗' },
  { id: '1', name: '休假中' },
  { id: '2', name: '已离职' },
  { id: '3', name: '待转岗' },
  { id: '4', name: '待休假' },
  { id: '5', name: '待离职' },
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
  JOB_STATUS,
  VISIT_RIGHT_LIST,
  DATA_ANALYST_ID,
  TABLE_PAGES_NUM,
  BOTTOM_TABLE_LIST,
  BOTTOM_TABLE_STATUS,
  GLOBAL_HEADER_SELECT,
};
