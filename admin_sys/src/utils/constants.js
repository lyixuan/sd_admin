/**
 * 静态常量文件
 * */
// time
export const TIME_LOCAL = 'zh-cn';

// localstorage key
export const ADMIN_AUTH_LIST = 'admin_auth';
export const ADMIN_USER = 'admin_user';

export const ROLE_TYPE_LIST = [
  { id: 'college', name: '院长或副院长' },
  { id: 'family', name: '家族长' },
  { id: 'group', name: '运营长' },
  { id: 'class', name: '班主任' },
  { id: 'admin', name: 'admin' },
  { id: 'boss', name: '管理层' },
  { id: 'others', name: '无绩效岗位' },
];
export const BOTTOM_TABLE_LIST = [
  { id: '', name: '全部' },
  { id: 0, name: '学分底表' },
  { id: 1, name: '预估分底表' },
];
export const BOTTOM_TABLE_STATUS = [
  { id: 0, name: '打包中' },
  { id: 1, name: '打包完成' },
  { id: 2, name: '打包错误' },
];
// 需要用于global filter 进行数据筛选的，必须加到default里
export default {
  TIME_LOCAL,
  ADMIN_AUTH_LIST,
  ADMIN_USER,
  ROLE_TYPE_LIST,
  BOTTOM_TABLE_LIST,
  BOTTOM_TABLE_STATUS,
};
