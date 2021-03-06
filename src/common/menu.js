import { getAuthority } from '../utils/authority';

function getAuthData() {
  const data1 = getAuthority('admin_auth') || [];
  const newArr = filterMenu(data1).sort((a, b) => a.sortFlag - b.sortFlag);
  return formatter(newArr, 0);
}
function filterMenu(data) {
  // 将首页过滤掉
  return data.filter(
    item => item.level <= 2 && item.resourceUrl !== '/' && item.resourceUrl !== '/indexPage'
  );
}

function formatter(data, parentId) {
  const itemArr = [];
  for (let i = 0; i < data.length; i += 1) {
    const node = data[i];
    // 如果level是3的话,是功能页面,并不展示
    if (Number(node.parentId) === Number(parentId) || Number(node.pid) === Number(parentId)) {
      const newNode = {
        icon: node.iconUrl,
        id: node.id,
        name: node.name,
        path: node.resourceUrl,
        authority: true,
        hideInMenu: false, // level的等级大于2的话为功能权限
        children: formatter(data, node.id),
      };
      itemArr.push(newNode);
    }
  }
  return itemArr;
}

export function getMenuData() {
  return getAuthData();
}
