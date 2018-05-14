import {parse} from 'url';

  const dataIndexList={
        code:200,
        msg:null,
        status:true,
        data:[
          {
              "name":"开班电话",
              "id":12,
              "rawDataDes":"开班电话"
          },
          {
              "name":"随堂考",
              "id":13,
              "rawDataDes":"随堂考"
          },
          {
              "name":"未回复会话",
              "id":15,
              "rawDataDes":"未回复会话"
          },
          {
            "name":"直播时间",
            "id":1,
            "rawDataDes":"直播时间"
        },
        {
            "name":"重播时间",
            "id":2,
            "rawDataDes":"重播时间"
        },
        {
            "name":"测试time",
            "id":3,
            "rawDataDes":"测试time"
        }
    ]
}

export function getCreditDementionList(req, res, u) {
    if (res && res.json) {
      res.json(dataIndexList);
    } else {
      return dataIndexList;
    }
  }
  
  export default { getCreditDementionList }