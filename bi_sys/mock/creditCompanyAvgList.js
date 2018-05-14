import {parse} from 'url';

const dataIndexList={
    selfExam: {
        id: 12345,
        title:"自编测试",
        companyScore: 1.32,
        firstCredit:10.2,
        total: 4,
        data: [
          {
              groupId:104,
              name:"芝士学院",
              val:0,
              date:'2018.04.19'
            },
            {
                groupId:104,
                name:"芝士学院",
                val:0,
                date:'2018.04.24'
              },
              {
                groupId:104,
                name:"芝士学院",
                val:0,
                date:'2018.04.28'
              }
        ]
      }
    }
export function getCreditCompanyAvgList(req, res, u) {
    // let url = u;
    // if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    //   url = req.url; // eslint-disable-line
    // }
    //
    // const params = parse(url, true).query;  // 处理参数问题
  
  
    if (res && res.json) {
      res.json(dataIndexList);
    } else {
      return dataIndexList;
    }
  }
  
  export default { getCreditCompanyAvgList}