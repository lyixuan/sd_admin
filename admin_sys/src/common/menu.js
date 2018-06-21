import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '质检',
    icon: 'check-circle-o',
    path: 'quality',
    children: [
      {
        name: '质检列表',
        path: 'qualityList',
      },
      {
        name: '添加质检',
        path: 'qualityAdd',
        hideInMenu: true,
      },
      {
        name: '删除质检',
        path: 'qualityDel',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账号管理',
    icon: 'check-circle-o',
    path: 'account',
    children: [
      {
        name: '账号管理',
        path: 'accountList',
      },
      {
        name: '创建账号',
        path: 'createAccount',
        hideInMenu: true,
      },
      {
        name: '编辑账号',
        path: 'editAccount',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '角色管理',
    icon: 'check-circle-o',
    path: 'role',
    children: [
      {
        name: '角色管理',
        path: 'roleList',
      },
      {
        name: '创建角色',
        path: 'createRole',
        hideInMenu: true,
      },
      {
        name: '查看角色',
        path: 'checkrole',
        hideInMenu: true,
      },
      {
        name: '编辑角色',
        path: 'editRole',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'check-circle-o',
    path: 'user',
    children: [
      {
        name: '用户管理',
        path: 'userList',
      },
      {
        name: '创建用户',
        path: 'createUser',
        hideInMenu: true,
      },
      {
        name: '查看用户',
        path: 'checkUser',
        hideInMenu: true,
      },
      {
        name: '编辑用户',
        path: 'editUser',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '退费管理',
    icon: 'check-circle-o',
    path: 'refund',
    children: [
      {
        name: '退费列表',
        path: 'refundList',
      },
      {
        name: '添加退费',
        path: 'refundAdd',
        hideInMenu: false,
      },
      {
        name: '删除退费',
        path: 'refundDel',
        hideInMenu: false,
      },
    ],
  },
  {
    name: '投诉管理',
    icon: 'check-circle-o',
    path: 'complaint',
    children: [
      {
        name: '投诉列表',
        path: 'complaintList',
      },
      {
        name: '添加投诉',
        path: 'complaintAdd',
        hideInMenu: false,
      },
      {
        name: '删除投诉',
        path: 'complaintDel',
        hideInMenu: false,
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    hideInMenu: true,
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
      },
    ],
  },
  {
    name: '登录',
    icon: 'user',
    path: 'userLayout',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
      hideInMenu: item.hideInMenu || false,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
