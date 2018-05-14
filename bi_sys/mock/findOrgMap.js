import {parse} from 'url';

const organization = {
  code: 0,
  msg: "success",
  status: true,
  data: [{
    "id": 497,
    "collegeId": 1011,
    "collegeName": "图灵学院",
    "collegeShortName": null,
    "familyId": 267,
    "familyName": "计算机信息管理本科1",
    "familyShortName": null,
    "familyType": 2,
    "groupId": 153,
    "groupName": "运营二组",
    "codeNameId": 2192,
    "codeName": "张玮玮",
    "cpId": 5453,
    "cpName": "张玮玮",
    "cpEmail263": null
  },
    {
      "id": 498,
      "collegeId": 1012,
      "collegeName": "图灵学院",
      "collegeShortName": null,
      "familyId": 267,
      "familyName": "计算机信息管理本科1",
      "familyShortName": null,
      "familyType": 2,
      "groupId": 152,
      "groupName": "运营一组",
      "codeNameId": 2193,
      "codeName": "张皓然",
      "cpId": 5356,
      "cpName": "张皓然",
      "cpEmail263": null
    },
    {
      "id": 499,
      "collegeId": 1011,
      "collegeName": "图灵学院",
      "collegeShortName": null,
      "familyId": 267,
      "familyName": "计算机信息管理本科1",
      "familyShortName": null,
      "familyType": 2,
      "groupId": 168,
      "groupName": "运营三组",
      "codeNameId": 2425,
      "codeName": "刘丽姝",
      "cpId": 5439,
      "cpName": "刘丽姝",
      "cpEmail263": null
    },
    {
      "id": 500,
      "collegeId": 1013,
      "collegeName": "希格斯学院",
      "collegeShortName": null,
      "familyId": 292,
      "familyName": "会展管理专科",
      "familyShortName": null,
      "familyType": 2,
      "groupId": null,
      "groupName": "",
      "codeNameId": 2422,
      "codeName": "梁莹凤",
      "cpId": 3208,
      "cpName": "梁莹凤",
      "cpEmail263": null
    },
    {
      "id": 501,
      "collegeId": 1013,
      "collegeName": "希格斯学院",
      "collegeShortName": null,
      "familyId": 293,
      "familyName": "会展管理本科",
      "familyShortName": null,
      "familyType": 2,
      "groupId": null,
      "groupName": "",
      "codeNameId": 2423,
      "codeName": "刘旭东",
      "cpId": 5865,
      "cpName": "刘旭东",
      "cpEmail263": null
    },
    {
      "id": 502,
      "collegeId": 1010,
      "collegeName": "开放学院",
      "collegeShortName": null,
      "familyId": 265,
      "familyName": "国开人力组1",
      "familyShortName": null,
      "familyType": 2,
      "groupId": null,
      "groupName": "",
      "codeNameId": 2030,
      "codeName": "陈圳",
      "cpId": 5119,
      "cpName": "陈圳",
      "cpEmail263": null
    },
    {
      "id": 503,
      "collegeId": 1010,
      "collegeName": "开放学院",
      "collegeShortName": null,
      "familyId": 295,
      "familyName": "国开人力组2",
      "familyShortName": null,
      "familyType": 2,
      "groupId": 171,
      "groupName": "运营一组",
      "codeNameId": 2075,
      "codeName": "王洋",
      "cpId": 5144,
      "cpName": "王洋",
      "cpEmail263": null
    },
    {
      "id": 504,
      "collegeId": 1010,
      "collegeName": "开放学院",
      "collegeShortName": null,
      "familyId": 265,
      "familyName": "国开人力组1",
      "familyShortName": null,
      "familyType": 2,
      "groupId": 169,
      "groupName": "运营一组",
      "codeNameId": 2225,
      "codeName": "席俊义",
      "cpId": 5558,
      "cpName": "席俊义",
      "cpEmail263": null
    },
    {
      "id": 505,
      "collegeId": 1001,
      "collegeName": "旅游学院",
      "collegeShortName": null,
      "familyId": 218,
      "familyName": "哎呦家族",
      "familyShortName": null,
      "familyType": 2,
      "groupId": 161,
      "groupName": "运营二组",
      "codeNameId": 1730,
      "codeName": "唐晓冬",
      "cpId": 4612,
      "cpName": "唐晓冬",
      "cpEmail263": null
    },
    {
      "id": 506,
      "collegeId": 1001,
      "collegeName": "旅游学院",
      "collegeShortName": null,
      "familyId": 218,
      "familyName": "哎呦家族",
      "familyShortName": null,
      "familyType": 2,
      "groupId": 160,
      "groupName": "运营一组",
      "codeNameId": 1791,
      "codeName": "刘海花",
      "cpId": 4719,
      "cpName": "刘海花",
      "cpEmail263": null
    },
    {
      "id": 507,
      "collegeId": 1001,
      "collegeName": "旅游学院",
      "collegeShortName": null,
      "familyId": 218,
      "familyName": "哎呦家族",
      "familyShortName": null,
      "familyType": 2,
      "groupId": 160,
      "groupName": "运营一组",
      "codeNameId": 1847,
      "codeName": "许佳",
      "cpId": 4871,
      "cpName": "许佳",
      "cpEmail263": null
    },
    {
      "id": 508,
      "collegeId": 1001,
      "collegeName": "旅游学院",
      "collegeShortName": null,
      "familyId": 218,
      "familyName": "哎呦家族",
      "familyShortName": null,
      "familyType": 2,
      "groupId": 161,
      "groupName": "运营二组",
      "codeNameId": 2014,
      "codeName": "罗婧雯",
      "cpId": 5086,
      "cpName": "罗婧雯",
      "cpEmail263": null
    },
    {
      "id": 509,
      "collegeId": 1003,
      "collegeName": "旅游学院",
      "collegeShortName": null,
      "familyId": 218,
      "familyName": "哎呦家族",
      "familyShortName": null,
      "familyType": 2,
      "groupId": 160,
      "groupName": "运营一组",
      "codeNameId": 2220,
      "codeName": "潘伟坚",
      "cpId": 5545,
      "cpName": "潘伟坚",
      "cpEmail263": null
    },
    {
      "id": 510,
      "collegeId": 106,
      "collegeName": "格致学院",
      "collegeShortName": null,
      "familyId": 156,
      "familyName": "自考全国工商专业",
      "familyShortName": null,
      "familyType": 0,
      "groupId": 43,
      "groupName": "运营四组",
      "codeNameId": 135,
      "codeName": "杨春波",
      "cpId": 4842,
      "cpName": "杨春波",
      "cpEmail263": null
    },
    {
      "id": 511,
      "collegeId": 106,
      "collegeName": "格致学院",
      "collegeShortName": null,
      "familyId": 156,
      "familyName": "自考全国工商专业",
      "familyShortName": null,
      "familyType": 0,
      "groupId": 39,
      "groupName": "运营一组",
      "codeNameId": 527,
      "codeName": "徐隆宇1",
      "cpId": 3966,
      "cpName": "徐隆宇",
      "cpEmail263": null
    },
    {
      "id": 512,
      "collegeId": 106,
      "collegeName": "格致学院",
      "collegeShortName": null,
      "familyId": 156,
      "familyName": "自考全国工商专业",
      "familyShortName": null,
      "familyType": 0,
      "groupId": 47,
      "groupName": "运营六组",
      "codeNameId": 1174,
      "codeName": "周帆",
      "cpId": 4464,
      "cpName": "周帆",
      "cpEmail263": null
    },
    {
      "id": 513,
      "collegeId": 106,
      "collegeName": "格致学院",
      "collegeShortName": null,
      "familyId": 156,
      "familyName": "自考全国工商专业",
      "familyShortName": null,
      "familyType": 0,
      "groupId": 42,
      "groupName": "运营三组",
      "codeNameId": 1196,
      "codeName": "赵紫晶",
      "cpId": 4003,
      "cpName": "赵紫晶",
      "cpEmail263": null
    },
    {
      "id": 514,
      "collegeId": 106,
      "collegeName": "格致学院",
      "collegeShortName": null,
      "familyId": 156,
      "familyName": "自考全国工商专业",
      "familyShortName": null,
      "familyType": 0,
      "groupId": 46,
      "groupName": "运营五组",
      "codeNameId": 1457,
      "codeName": "王双",
      "cpId": 5012,
      "cpName": "王双",
      "cpEmail263": null
    },
    {
      "id": 515,
      "collegeId": 106,
      "collegeName": "格致学院",
      "collegeShortName": null,
      "familyId": 156,
      "familyName": "自考全国工商专业",
      "familyShortName": null,
      "familyType": 0,
      "groupId": 41,
      "groupName": "运营二组",
      "codeNameId": 1458,
      "codeName": "熊文杰",
      "cpId": 4273,
      "cpName": "熊文杰",
      "cpEmail263": null
    },
    {
      "id": 516,
      "collegeId": 106,
      "collegeName": "格致学院",
      "collegeShortName": null,
      "familyId": 156,
      "familyName": "自考全国工商专业",
      "familyShortName": null,
      "familyType": 0,
      "groupId": 50,
      "groupName": "运营七组",
      "codeNameId": 2222,
      "codeName": "朱娉",
      "cpId": 5551,
      "cpName": "朱娉",
      "cpEmail263": null
    },
    {
      "id": 517,
      "collegeId": 106,
      "collegeName": "格致学院",
      "collegeShortName": null,
      "familyId": 156,
      "familyName": "自考全国工商专业",
      "familyShortName": null,
      "familyType": 0,
      "groupId": 39,
      "groupName": "运营一组",
      "codeNameId": 2330,
      "codeName": "徐隆宇",
      "cpId": 3966,
      "cpName": "徐隆宇",
      "cpEmail263": null
    },
    {
      "id": 518,
      "collegeId": 108,
      "collegeName": "泰罗学院",
      "collegeShortName": null,
      "familyId": 220,
      "familyName": "人力资格证1",
      "familyShortName": null,
      "familyType": 1,
      "groupId": 104,
      "groupName": "运营一组",
      "codeNameId": 714,
      "codeName": "李庆",
      "cpId": 4685,
      "cpName": "李庆",
      "cpEmail263": null
    },
    {
      "id": 519,
      "collegeId": 108,
      "collegeName": "泰罗学院",
      "collegeShortName": null,
      "familyId": 220,
      "familyName": "人力资格证1",
      "familyShortName": null,
      "familyType": 1,
      "groupId": 106,
      "groupName": "运营三组",
      "codeNameId": 1176,
      "codeName": "宋梓潇",
      "cpId": 4808,
      "cpName": "宋梓潇",
      "cpEmail263": null
    },
    {
      "id": 520,
      "collegeId": 108,
      "collegeName": "泰罗学院",
      "collegeShortName": null,
      "familyId": 250,
      "familyName": "人力本一组",
      "familyShortName": null,
      "familyType": 0,
      "groupId": 111,
      "groupName": "运营一组",
      "codeNameId": 1624,
      "codeName": "韩强民",
      "cpId": 4338,
      "cpName": "韩强民",
      "cpEmail263": null
    },]
};


export function getOrgMap(req, res, u) {
  // let url = u;
  // if (!url || Object.prototype.toString.call(url) !== '[object String]') {
  //   url = req.url; // eslint-disable-line
  // }
  //
  // const params = parse(url, true).query;  // 处理参数问题


  if (res && res.json) {
    res.json(organization);
  } else {
    return organization;
  }
}

export default {
  getOrgMap,
};
