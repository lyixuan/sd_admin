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
    ],
  },

  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '成功',
        path: 'success',
      },
      {
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
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
        // hideInMenu: true,
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
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
