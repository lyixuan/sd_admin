const authMap = {
  在岗: [{ title: '查看详情', path: '' }, { title: '转岗' }, { title: '休假' }, { title: '离职' }],
  待转岗: [{ title: '查看详情' }, { title: '编辑转岗' }, { title: '休假' }, { title: '离职' }],
  待休假: [{ title: '查看详情' }, { title: '编辑休假' }, { title: '转岗' }, { title: '离职' }],
  休假中: [{ title: '查看详情' }, { title: '编辑休假' }, { title: '转岗' }, { title: '离职' }],
  待离职: [{ title: '查看详情' }, { title: '编辑离职' }, { title: '转岗' }, { title: '休假' }],
  已离职: [{ title: '查看详情' }],
};
const buttonPath = {
  查看详情: '/privilege/staff/detail',
  转岗: '/privilege/staff/createTransJob',
  休假: '/privilege/Staff/createHoliday',
  离职: '/privilege/Staff/createDimission',
  编辑转岗: '/privilege/Staff/editTransJob',
  编辑休假: '/privilege/Staff/editHoliday',
  编辑离职: '/privilege/Staff/editDimission',
};
export function renderAuthButtonList(currentStateName = '') {
  let buttonList = [];
  if (typeof currentStateName === 'string' && currentStateName.length > 0) {
    const nameList = currentStateName.split('、');
    Object.keys(authMap).forEach(item => {
      const isSame = nameList.find(name => name === item);
      if (isSame) {
        buttonList = [...buttonList, ...authMap[item]];
      }
    });
  }
  const returnObj = [];
  buttonList.forEach(list => {
    if (!returnObj.find(item => item.title === list.title)) {
      returnObj.push({ ...list, path: buttonPath[list.title] });
    }
  });
  return returnObj;
}
