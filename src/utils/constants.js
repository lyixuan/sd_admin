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
// 数据分析师id
export const DATA_ANALYST_ID = '122';

export const DEBUGGER_USER = {
  localhost: 'zhanglulu02',
}[process.env.LOGIN_HOST];

// 下载类资源host
export const STATIC_HOST = {
  development: 'http://172.16.117.65:8091',
  production: 'http://api.bd.ministudy.com/download',
}[process.env.API_TYPE];

// 设置domain域名
export const DOMAIN_HOST = '.ministudy.com';
// export const DOMAIN_HOST = 'localhost';
export const CAS_HOST = {
  localhost: 'http://test.xd.admin.ministudy.com',
  development: 'http://test.xd.admin.ministudy.com',
  production: 'http://bd.ministudy.com',
}[process.env.LOGIN_HOST];

// 设置督学模块跳转
export const INSPECTOR_HOST = {
  localhost: 'http://test.xd.admin.ministudy.com',
  development: 'http://test.xd.admin.ministudy.com',
  production: 'http://bd.ministudy.com',
}[process.env.LOGIN_HOST];

// Global Header Select
export const GLOBAL_HEADER_SELECT = [
  { id: 'changeRole', name: '切换角色', icon: 'user' },
  // { id: 'changePwd', name: '修改密码', icon: 'lock' },
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

// 用户级别
export const USER_LEVEL = [
  { id: 'college', name: '学院级' },
  { id: 'family', name: '家族级' },
  { id: 'group', name: '小组级' },
];

// 考核周期
export const CHECK_CYCLE = [{ id: '1', name: '月度' }, { id: '2', name: '季度' }];

// 报名状态
export const APPLY_STATE = [
  { id: null, name: '全部' },
  { id: '1', name: '待审核' },
  { id: '2', name: '已审核' },
];

// 报名结果
export const APPLY_RESULT = [
  { id: null, name: '全部' },
  { id: '1', name: '通过' },
  { id: '2', name: '未通过' },
];

// 认证状态
export const CERTIFICATION_STATE = [
  { id: null, name: '全部' },
  { id: '1', name: '待审核' },
  { id: '2', name: '已审核' },
  { id: '3', name: '已发布' },
];

// 认证结果
export const CERTIFICATION_RESULT = [
  { id: null, name: '全部' },
  { id: '1', name: '通过' },
  { id: '2', name: '未通过' },
];

// 认证管理报名通道状态
export const Certification_TYPE = [
  { id: undefined, name: '全部' },
  { id: '1', name: '已开放' },
  { id: '2', name: '已关闭' },
  { id: '3', name: '已停用' },
  { id: '4', name: '已删除' },
];
// 认证管理报名通道状态
export const Certification_TIMEAREA = [
  { id: undefined, name: '全部' },
  { id: '1', name: '月度' },
  { id: '2', name: '季度' },
];
// 好学生推荐等级
export const RECOMMEND_LEVEL = [
  { id: 0, name: '60分钟以下' },
  { id: 1, name: '60至120分钟' },
  { id: 2, name: '120分钟以上' },
];

// 认证管理申请方式
export const Certification_APPLYMETHOD = [{ id: 200, name: '电脑端' }, { id: 100, name: '手机端' }];
// 认证管理适用用户
export const Certification_SUITUSER = [
  { id: 100, name: '指定用户' },
  { id: 200, name: '岗位不限' },
];
// 认证管理指定用户
export const Certification_ONLYUSER = [
  { id: 'class', name: '班主任' },
  { id: 'group', name: '运营长' },
];
// 底线类型
export const BOTTOM_LINE_TYPE = [{ id: 3, name: '退费' }, { id: 5, name: '退挽' }];

// 需要用于global filter 进行数据筛选的，必须加到default里
export default {
  Certification_TYPE,
  Certification_TIMEAREA,
  Certification_APPLYMETHOD,
  Certification_SUITUSER,
  Certification_ONLYUSER,
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
  USER_LEVEL,
  CHECK_CYCLE,
  APPLY_STATE,
  APPLY_RESULT,
  CERTIFICATION_STATE,
  CERTIFICATION_RESULT,
  RECOMMEND_LEVEL,
  BOTTOM_LINE_TYPE,
};
