const authMap = {
  在岗: { hasAuthName: ['查看详情', '转岗', '休假', '离职'], removeAuthName: ['编辑转岗'] },
  待转岗: { hasAuthName: ['查看详情', '编辑转岗', '休假', '离职'], removeAuthName: ['转岗'] },
  待离职: { hasAuthName: ['查看详情', '编辑离职', '转岗', '休假'], removeAuthName: ['离职'] },
  已离职: { hasAuthName: ['查看详情'], removeAuthName: [] },
  待休假: { hasAuthName: ['查看详情', '编辑休假', '转岗', '离职'], removeAuthName: ['休假'] },
  休假中: { hasAuthName: ['查看详情', '编辑休假', '转岗', '离职'], removeAuthName: ['休假'] },
};
const buttonPath = {
  查看详情: '/privilege/staff/detail',
  转岗: '/privilege/staff/createTransJob',
  休假: '/privilege/staff/createHoliday',
  离职: '/privilege/staff/createDimission',
  编辑转岗: '/privilege/staff/editTransJob',
  编辑休假: '/privilege/staff/editHoliday',
  编辑离职: '/privilege/staff/editDimission',
};
export function renderAuthButtonList(currentStateName = '') {
  let buttonList = [];
  let removeAuthNameList = [];
  if (typeof currentStateName === 'string' && currentStateName.length > 0) {
    const nameList = currentStateName.split('、');
    Object.keys(authMap).forEach(item => {
      const isSame = nameList.find(name => name === item);
      if (isSame) {
        buttonList = buttonList.concat(authMap[item].hasAuthName);
        buttonList = [...new Set(buttonList)];
        removeAuthNameList = removeAuthNameList.concat(authMap[item].removeAuthName);
        removeAuthNameList = [...new Set(removeAuthNameList)];
      }
    });
  }
  const returnObj = [];
  buttonList.forEach(list => {
    if (!removeAuthNameList.find(item => item === list)) {
      returnObj.push({ title: list, path: buttonPath[list] });
    }
  });
  return returnObj;
}
