import {parse} from 'url';

  const dataIndexList={
          code:200,
          msg:null,
          status:true,
          data:{
            titleOne:'报名日期',
            titleTwo:'学员姓名',
            titleThree:'直播时长',
            titleFour:'随堂考时间',
            //  data:null
            data:[
              {id:1,valOne:'2018-05-01',valTwo:'满振华',valThree:'1234567',valFour:'test'},
              {id:3,valOne:'2018-05-02',valTwo:'王晶晶',valThree:'9876564',valFour:'test'},
              {id:5,valOne:'2018-05-03',valTwo:'晓静',valThree:'0000000',valFour:'test'},
              {id:7,valOne:'2018-05-04',valTwo:'一儒',valThree:'1111111',valFour:'test'},
              {id:12,valOne:'2018-05-05',valTwo:'庞洋',valThree:'2222222',valFour:'test'},
              {id:11,valOne:'2018-05-01',valTwo:'满振华',valThree:'1234567',valFour:'test'},
              {id:13,valOne:'2018-05-02',valTwo:'王晶晶',valThree:'9876564',valFour:'test'},
              {id:15,valOne:'2018-05-03',valTwo:'晓静',valThree:'0000000',valFour:'test'},
              {id:16,valOne:'2018-05-04',valTwo:'一儒',valThree:'1111111',valFour:'test'},
              {id:17,valOne:'2018-05-05',valTwo:'庞洋',valThree:'2222222',valFour:'test'}
            ]
          }
}
export function getdementionTypeList(req, res, u) {
    if (res && res.json) {
      res.json(dataIndexList);
    } else {
      return dataIndexList;
    }
  }
  
  export default { getdementionTypeList}