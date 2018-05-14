import {parse} from 'url';
  const dataIndexList={
        code:200,
        msg:null,
        status:true,
        data:[
          {key:'3.20',val:8},
          {key:'3.21',val:10},
          {key:'3.22',val:5},
          {key:'3.23',val:6},
          {key:'3.24',val:2},
          {key:'3.25',val:7},
        ]
      }

export function getQueryCreditTrend(req, res, u) {
    if (res && res.json) {
      res.json(dataIndexList);
    } else {
      return dataIndexList;
    }
  }
  
  export default { getQueryCreditTrend}