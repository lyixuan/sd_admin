import {parse} from 'url';

const creditTrendAvgList = {


  selfExam: {
    id: 12345,
    title:'汉语言1',
    companyScore: 1.32,
    firstCredit:10.2,
    total: 4,
    data: {
      companyCredit:[{key:'3.20',val:20,type:1},{key:'3.21',val:21,type:1},{key:'3.20',val:23,type:2},{key:'3.21',val:24,type:2}],
      group:{id:'1111',data:[{key:'3.20',val:20},{key:'3.21',val:21}]}
    }
  },

  barrier:{
    id: 12345,
    title:'汉语言2',
    companyScore: 1.32,
    firstCredit:10.2,
    total: 4,
    data: {
      companyCredit:[{key:'3.20',val:20,type:1},{key:'3.21',val:21,type:1},{key:'3.20',val:23,type:2},{key:'3.21',val:24,type:2}],
      group:{id:'1111',data:[{key:'3.20',val:20},{key:'3.21',val:21}]}
    }
  } ,
  incubator: {
    id: 12345,
    title:'汉语言3',
    companyScore: 1.32,
    firstCredit:10.2,
    total: 4,
    data: {
      companyCredit:[{key:'3.20',val:20,type:1},{key:'3.21',val:21,type:1},{key:'3.20',val:23,type:2},{key:'3.21',val:24,type:2}],
      group:{id:'1111',data:[{key:'3.20',val:20},{key:'3.21',val:21}]}
    }
  },
};
export function getCreditTrendAvgList(req, res, u) {
  // let url = u;
  // if (!url || Object.prototype.toString.call(url) !== '[object String]') {
  //   url = req.url; // eslint-disable-line
  // }
  //
  // const params = parse(url, true).query;  // 处理参数问题


  if (res && res.json) {
    res.json(creditTrendAvgList);
  } else {
    return creditTrendAvgList;
  }
}

export default {
  getCreditTrendAvgList,
};
