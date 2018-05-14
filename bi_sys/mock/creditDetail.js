import {parse} from 'url';
const strickFirData ={
     selfExam:[
      {category:'家族(自考)',project:'自变量',score:0.3,groupId:1,rank:3,groupTotal:12,firstScore:0.8,groupType:1},
      {category:'家族(自考)',project:'自变量',score:0.3,groupId:2,rank:3,groupTotal:12,firstScore:0.8,groupType:1},
      {category:'家族(自考)',project:'自变量',score:0.3,groupId:3,rank:3,groupTotal:12,firstScore:0.8,groupType:2},
      ],
            
      barrier:[{category:'家族(bilei)',project:'自变量',score:0.3,groupId:4,rank:3,groupTotal:12,firstScore:0.8,groupType:3},
       {category:'家族(自考)',project:'自变量',score:0.3,groupId:5,rank:5,groupTotal:12,firstScore:0.8,groupType:2},
      {category:'家族(自考)',project:'自变量',score:0.3,groupId:6,rank:6,groupTotal:12,firstScore:0.8,groupType:1},
      {category:'家族(自考)',project:'自变量',score:0.3,groupId:7,rank:7,groupTotal:12,firstScore:0.8,groupType:2},],
     
      incubator:[{category:'家族(自考)',project:'自变量',score:0.3,groupId:8,rank:3,groupTotal:12,firstScore:0.8,groupType:1},]
        
}

const strickSecData ={
        items:[
            {title:'我的得分',positive:26.5,negative:23.4,type:1},
            {title:'集团得分',positive:26.5,negative:23.4,type:2}
          ]
        
}

const firCreditData ={
        selfExam:{
          category:1,
          creditScore:1,
          data:[ 
            {id:1,category:'排学院无',project:'排学院',rank:1,total:20,creditScore:10,number:4},
            {id:2,category:'2',project:'',rank:1,total:20,creditScore:10,number:4},
            {id:3,category:'1',project:'',rank:1,total:20,creditScore:10,number:4},
            {id:4,category:'300',project:'',rank:1,total:20,creditScore:10,number:4}
          ]
        },
        barrier:{
          category:1,
          creditScore:1,
          data:[ 
            {id:5,category:'111',project:'',rank:1,total:20,creditScore:10,number:4},
            {id:6,category:'2',project:'',rank:1,total:20,creditScore:10,number:4},
            {id:7,category:'1',project:'',rank:1,total:20,creditScore:10,number:4},
            {id:8,category:'311',project:'',rank:1,total:20,creditScore:10,number:4}
          ]
        },
        incubator:{
          category:1,
          creditScore:1,
          data:[ 
            {id:9,category:'222',project:'',rank:1,total:20,creditScore:10,number:4},
            {id:10,category:'2',project:'',rank:1,total:20,creditScore:10,number:4},
            {id:11,category:'1',project:'',rank:1,total:20,creditScore:10,number:4},
            {id:12,category:'322',project:'',rank:1,total:20,creditScore:10,number:4}
          ]
  }
}

const secCreditData = [
  {id:1,parentid:2,project:'正面得分',rank:1,total:20,creditScore:10,number:4,data:[
    {id:11,parentid:1,project:'学术直播得分学',rank:1,total:20,creditScore:10,number:4,data:[
      {id:211,parentid:11,project:'学术直播得分',rank:1,total:20,creditScore:10,number:4},
      {id:22,parentid:11,project:'学术直播得分',rank:1,total:20,creditScore:10,number:4},
      {id:23,parentid:11,project:'学术直播得分',rank:1,total:20,creditScore:10,number:4}
    ]},
    {id:11,parentid:1,project:'学术得分1',rank:1,total:20,creditScore:10,number:4,data:[
      {id:13,parentid:11,project:'学术直播得分',rank:1,total:20,creditScore:10,number:4},
      {id:13111,parentid:11,project:'学术直播得分',rank:1,total:20,creditScore:10,number:4},
      {id:1121,parentid:11,project:'计算机信管1•1组',rank:1,total:20,creditScore:10,number:4}
    ]}
  ]},
  {id:1,parentid:2,project:'正面得分2',rank:1,total:20,creditScore:10,number:4,data:[
    {id:12,parentid:1,project:'学术得分2',rank:1,total:20,creditScore:10,number:4,data:[
      {id:1111,parentid:11,project:'计算机信管1•1组',rank:1,total:20,creditScore:10,number:4},
      {id:1411,parentid:11,project:'学术直播得分',rank:1,total:20,creditScore:10,number:4},
      {id:11,parentid:11,project:'学术直播得分',rank:1,total:20,creditScore:10,number:4}
    ]},
    {id:11,parentid:1,project:'学术得分3',rank:1,total:20,creditScore:10,number:4,data:[
      {id:111,parentid:11,project:'学术直播得分',rank:1,total:20,creditScore:10,number:4},
      {id:111,parentid:11,project:'学术直播得分',rank:1,total:20,creditScore:10,number:4},
      {id:111,parentid:11,project:'学术直播得分',rank:1,total:20,creditScore:10,number:4}
    ]}
  ]}
]


export function getSecCreditData(req, res, u) {
  // let url = u;
  // if (!url || Object.prototype.toString.call(url) !== '[object String]') {
  //   url = req.url; // eslint-disable-line
  // }
  //
  // const params = parse(url, true).query;  // 处理参数问题


  if (res && res.json) {
    res.json(secCreditData);
  } else {
    return secCreditData;
  }
}
export function getFirCreditData(req, res, u) {


  if (res && res.json) {
    res.json(firCreditData);
  } else {
    return firCreditData;
  }
}
export function getStrickFirData(req, res, u) {


  if (res && res.json) {
    res.json(strickFirData);
  } else {
    return strickFirData;
  }
}
export function getStrickSecData(req, res, u) {


  if (res && res.json) {
    res.json(strickSecData);
  } else {
    return strickSecData;
  }
}
export default {
  getStrickFirData,
  getStrickSecData,
  getSecCreditData,
  getFirCreditData,
};
