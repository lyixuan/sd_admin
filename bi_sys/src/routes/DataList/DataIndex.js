import React from 'react';
import {connect} from 'dva';
import $ from 'jquery';
import styles from './DataIndex.css';
import {Link, RouterContext} from 'dva/router';
import {Button} from 'antd-mobile';
import Switch from 'rc-switch';
import SampleLineChart from '../../components/Chart/SampleLineChart';
import DetailTable from '../../components/Table/DetailTable';
import {weekMean} from '../../utils/FormatDate';
import {formatDate} from '../../utils/FormatDate';
import {monthMean} from '../../utils/FormatDate';
import homepng from '../../assets/home.png'
import { constants } from 'fs';
import 'antd-mobile/dist/antd-mobile.css';//暂时使用

const now = new Date();
//this.props.home.paramsObj.endTime
//头部容器
const headerDom = (obj = null, clickTab = null) => (
    <div className={styles.headerContainer} id="dataTop">
      <div className={styles.headerText}>
        <p className={styles.dateArea}>{obj.dateArea}</p>
        <p className={styles.headerTitle}>{obj.groupName}</p>
      </div>
      <div className={styles.headerleftimg}>
        <Link to="/home"><img className={styles.iconBtn} src={homepng}/></Link>
      </div>
      <div className={styles.tabBox} >
        <span className={`${styles.tabBtn} ${obj.scoreType === 1 ? styles.sectedBtn : ''}`} onClick={() => (clickTab(1))}>正面得分</span>
        <span className={`${styles.tabBtn} ${obj.scoreType === 2 ? styles.sectedBtn : ''}`} onClick={() => (clickTab(2))}>负面得分</span>
      </div>
    </div>
  )
;
//button区域容器
const btnContainer = (obj = null, fnClick = null) => (
  <div className={styles.btnContainer}>
    {obj.map((item, index) => (
      <Button className={styles.btnStyle} onClick={() => (fnClick(item))} key={index}>{item.name}</Button>
    ))}
  </div>
);

//趋势图区域
const chartContainer = (obj = null, fnSwitchBar = null) => {
  return(
    <div className={styles.chartContainer}>
    <Switch
      className={styles.switchStyle}
      onChange={(val) => (
        fnSwitchBar && fnSwitchBar(val)
      )}
      checkedChildren={'周均'}
      unCheckedChildren={'月均'} 
    />
      <SampleLineChart ref="SampleLineChart" fetchdata1={obj.props.dataIndex.dataObj1.data} chartdata2={obj.props.dataIndex.dataObj2} dementionId={obj.props.dataIndex.dementionId}/>  
  </div>
  )};

//数据列表区域
const dataList = (obj=null) => (
  <div className={styles.dataList}>
    <DetailTable dementionId={obj.props.dataIndex.dementionId}/>
  </div>
);
//页脚区域
// const foodDom = (obj = null) => (
//   <div className={styles.footbutton}>
//     <Button  type="primary" className={styles.subbutton} >
//       <div className={styles.wordstyle2}>
//         发送详细数据到邮箱
//       </div>
//     </Button>
//   </div>
// )

class DataIndex extends React.Component {
  constructor(props) {
    super(props)
    const startTime = formatDate(weekMean(now).startTime)
    const endTime = formatDate(weekMean(now).endTime)
    this.state = {
      dateArea: startTime+' - '+endTime,//根据用户选择时间区间显示到页头
      groupName: "自己编写数据",//this.props.location.state.groupName|| '测试',  //从上个页面获取
      scoreType: 2,//this.props.location.state.scoreType || 1,   //正面得分为1,负面的分为2，从上个页面获取的本页面初始值
    }
  }

  fnCLickTab(val = null) {  //点击正面，负面tab方法
    if (val == this.state.scoreType) {//console.log("防重复点击同样正反面")
    }else{
      const paramsObj1 = {groupId:301,type: val,startTime:1514788708000,endTime:weekMean(now).endTime};
      const paramsObj2 = {groupType:1,startTime:1514788708000,endTime:weekMean(now).endTime,familyType:1};
      const paramsObj3 = {groupType:1,familyType:1,startTime:1514788708000,endTime:weekMean(now).endTime};
      this.dataFetch(paramsObj1,paramsObj2,paramsObj3);
      this.setState({
        scoreType: val,
      })
    }
  }

  fnClickGroupButton(groupId) { //点击button触发的请求chart和table接口函数
    const dementionId = groupId.id
    if (groupId.id == this.props.dataIndex.dementionId) {//console.log("防重复点击同样button")
    }else{
      const paramsObj2 = {groupType:1,startTime:1514788708000,endTime:weekMean(now).endTime,familyType:1};
      this.dataChart(paramsObj2,dementionId);
      const paramsObj3 = {groupType:1,familyType:1,startTime:1514788708000,endTime:weekMean(now).endTime};
      this.dataTable(paramsObj3,dementionId);
  }
  }

  fnSwitchBar(val) {  //切换周均，月均switch
    const dementionId = this.props.dataIndex.dementionId
    if(val){
      const paramsObj2 = {groupType:1,startTime:1514788708000,endTime:weekMean(now).endTime,familyType:1};
      this.dataChart(paramsObj2,dementionId);
    }else{
      const paramsObj2 = {groupType:1,startTime:1514788708000,endTime:monthMean(now).endTime,familyType:1};
      this.dataChart(paramsObj2,dementionId);
    }
  }
  
  dataTable(param,dementionId){//请求model中的fetch方法
    let sendParams = {
      paramsObj3:  {...this.props.dataIndex.paramsObj3, ...param },
      dementionId:dementionId
    }
    this.props.dispatch({
      type: 'dataIndex/table',
      payload: sendParams,
    });
  }

  dataChart(param,dementionId){//请求model中的fetch方法
    let sendParams = {
      paramsObj2:  {...this.props.dataIndex.paramsObj2, ...param },
      dementionId:dementionId
    }
    this.props.dispatch({
      type: 'dataIndex/chart',
      payload: sendParams,
    });
  }

  dataFetch(param1,param2,param3){//请求model中的fetch方法
    let sendParams = {
      paramsObj1:  {...this.props.dataIndex.paramsObj1, ...param1 },
      paramsObj2:  {...this.props.dataIndex.paramsObj2, ...param2 },
      paramsObj3:  {...this.props.dataIndex.paramsObj3, ...param3 }
    }
    this.props.dispatch({
      type: 'dataIndex/fetch',
      payload: sendParams,
    });
  }

  componentDidMount () { 
  const paramsObj1 = {groupId:301,type: this.state.scoreType ,startTime:1514788708000,endTime:weekMean(now).endTime};
  const paramsObj2 = {groupType:1,startTime:1514788708000,endTime:weekMean(now).endTime,familyType:1};
  const paramsObj3 = {groupType:1,familyType:1,startTime:1514788708000,endTime:weekMean(now).endTime};
  this.dataFetch(paramsObj1,paramsObj2,paramsObj3);
    setTimeout(() => {
      this.suctionTop()
    }, 1000);
}

  suctionTop = ()=>{  //判断吸顶元素是否在页面可视范围内
    $(window).scroll(function () {
        var windowH = $(window).scrollTop()
        let dataH = $("#dataTop") ? ($("#dataTop").offset().top - windowH ): null;
        if(dataH < 0 ){
          $('#testup').fadeIn(100)
        }else{
          $('#testup').fadeOut(100)
        }
    })
  }

  topPosition(v){ //将要吸顶的div调整高度到页面顶部函数
      $('html, body').animate({scrollTop: $("#dataTop").offset().top}, 700)
  }

  render() {
    const dataObjtest = this.props.dataIndex.dataObj1;
    return (
      !dataObjtest ? <div className={styles.normal}>添加loading</div> : 
      !this.props.dataIndex.dataObj3 ? <div className={styles.normal}>添加loading</div> :
      <div className={styles.normal}>
      <div className = {styles.topBarCls} id="testup" onClick={()=>{this.topPosition()}}>03.20周五 - 03.22周日 | 层级 | 对象名称</div>
        {/*头部区域*/}
        {headerDom(this.state, this.fnCLickTab.bind(this))}
        {btnContainer(dataObjtest.data, this.fnClickGroupButton.bind(this))}
        {chartContainer(this, this.fnSwitchBar.bind(this))}
        {dataList(this)}
        {/*foodDom()*/}
      </div>)
  }
}

function mapStateToProps(dataIndex) {
  return dataIndex;
}

export default connect(mapStateToProps)(DataIndex);
