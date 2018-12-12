/**
 * 静态常量文件
 * */

export const ROLE_TYPE_LIST = [
  { id: 'college', name: '院长或副院长' },
  { id: 'family', name: '家族长' },
  { id: 'group', name: '运营长' },
  { id: 'class', name: '班主任' },
  { id: 'admin', name: 'admin' },
  { id: 'boss', name: '管理层' },
  { id: 'others', name: '无绩效岗位' },
];

// 需要用于global filter 进行数据筛选的，必须加到default里
export default {
  ROLE_TYPE_LIST,
};
