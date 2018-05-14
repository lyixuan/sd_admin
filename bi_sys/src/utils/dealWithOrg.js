export function getOrgMap(familyTypeData, groupType = null) {    //传入type值为1学院2家族3自考
  const collegeTypeObj = {1: 'collega', 2: 'family', 3: 'group'};
  const orgMap = {
    collega: [],
    family: [],
    group: [],
  }

  function uniq(array) {    //去重处理待优化
    let temp = [];
    let index = [];
    let l = array.length;
    for (let i = 0; i < l; i++) {
      for (let j = i + 1; j < l; j++) {
        if (array[i].id === array[j].id) {
          i++;
          j = i;
        }
      }
      temp.push(array[i]);
      index.push(i);
    }
    return temp;
  }

  familyTypeData.forEach(function (item) {
    const {collegeId, collegeName, familyId, familyName, familyType, groupId, groupName} = item;
    orgMap['collega'].push({id: collegeId, name: collegeName, familyType: familyType});
    orgMap['family'].push({id: familyId, name: familyName, familyType: familyType});
    orgMap['group'].push({id: groupId, name: groupName, familyType: familyType});
  });
  if (groupType === null) {
    for (let key in orgMap) {
      orgMap[key] = uniq(orgMap[key]);
    }
    return orgMap;
  } else {
    let key = collegeTypeObj[groupType];
     uniq(orgMap[key]);
    return uniq(orgMap[key]);
  }

}
