import {parse} from 'url';
const creditRankAvgList = {
  selfExam: {
    id: 12345,
    companyScore: 15.32,
    total: 4,
    data: [{key: '自变量', val: 20, groupId: 22234}, {key: '自变量1', val: 21, groupId: 22235},
      {key: '自变量3', val: 17, groupId: 22134}, {key: '自变量4', val: 213, groupId: 22234}]
  },
  barrier: {
    id: 123459,
    total: 14,
    companyScore: 12.32,
    data: [{key: '自变量', val: 20, groupId: 122234}, {key: '自变量1', val: 21, groupId: 122235},
      {key: '自变量3', val: 17, groupId: 122134}, {key: '自变量4', val: 213, groupId: 122234}]
  },
  incubator: {
    id: 123458,
    total: 14,
    companyScore: 12.32,
    data: [{key: '自变量', val: 20, groupId: 322234}, {key: '自变量1', val: 21, groupId: 322235},
      {key: '自变量3', val: 17, groupId: 322134}, {key: '自变量4', val: 213, groupId: 322234}]
  },
};




export function getCreditRankAvgList(req, res, u) {
  // let url = u;
  // if (!url || Object.prototype.toString.call(url) !== '[object String]') {
  //   url = req.url; // eslint-disable-line
  // }
  //
  // const params = parse(url, true).query;  // 处理参数问题


  if (res && res.json) {
    res.json(creditRankAvgList);
  } else {
    return creditRankAvgList;
  }
}

export default {
  getCreditRankAvgList,
};
