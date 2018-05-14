import {parse} from 'url';

const dataIndexList={
    items:[
        {
            id:1,
            college:'自变量',
            data:[
                {id:1,name:'法律1组',rank:1},
                {id:2,name:'数学2组',rank:2},
                {id:3,name:'英语3组',rank:3},
                {id:4,name:'汉语4组',rank:4},
                {id:5,name:'物理5组',rank:5},
                {id:6,name:'化学6组',rank:6}
            ]
        },
        {
            id:2,
            college:'helloword',
            data:[
                {id:11,name:'幼儿1组',rank:1},
                {id:22,name:'初中2组',rank:2},
                {id:33,name:'高中3组',rank:3},
                {id:44,name:'大学4组',rank:4},
                {id:55,name:'研究生5组',rank:5},
                {id:66,name:'博士6组',rank:6},
            ]
        },
        {
            id:3,
            college:'好好学习',
            data:[
                {id:111,name:'初级1组',rank:1},
                {id:211,name:'中级2组',rank:2},
                {id:311,name:'高级3组',rank:3},
                {id:411,name:'外国4组',rank:4},
                {id:511,name:'留学生5组',rank:5},
                {id:611,name:'地球6组',rank:6},
            ]
        }
    ]
}
export function getQueryTrendAll(req, res, u) {
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
  
  export default { getQueryTrendAll}