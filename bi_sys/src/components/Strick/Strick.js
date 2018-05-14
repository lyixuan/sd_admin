
import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {monthMean, weekMean, formatDate} from '../../utils/FormatDate'
import { StickyContainer, Sticky } from 'react-sticky';
import { Flex, ListView, Accordion, List } from 'antd-mobile';
import greenIcon from '../../assets/green.png'
import blueIcon from '../../assets/blue.png'
import yellowIcon from '../../assets/yellow.png'
import styles from './Strick.css';

const now = new Date();

class Demo extends Component {
   constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource
    };

  }
  componentDidMount() {
    let {startTime, endTime} = this.props.home.paramsObj;
    let {userid, groupid} = this.props.index.userInfo;
  
    this.dataFetchFir({
        startTime:startTime,
        endTime:endTime,
        // userId:userid,
        // groupId:groupid
    })
    this.setState({
      dataSource: this.genData(this.state.dataSource, this.props.Strick.dataList_D),
    });
  }

  componentWillReceiveProps(nextProps){//父组件的props改变，则子组件数据要跟着改变
      if(nextProps.Strick!=this.props.Strick){
          console.log(111)
      }
  }
  genData(ds, dataList) {
    const dataBlob = {};
    const sectionIDs = [];
    const rowIDs = [];
    if(this.props.Strick.dataList!=null){
      Object.keys(dataList).forEach((item, index) => {
        sectionIDs.push(item);
        dataBlob[item] = item;
        rowIDs[index] = [];
        dataList[item].forEach((jj) => {
        
          if(jj){
            rowIDs[index].push(jj.groupId);
            dataBlob[jj.groupId] = jj;
          }
        })
      });
    }else {
      setTimeout(() => {
        this.setState({
          dataSource: this.genData(this.state.dataSource, this.props.Strick.dataList_D),
        });
      }, 1000);
    }
    return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
  }
  dataFetchFir(param){//请求一级接口
      let sendParams = {
        paramsObj:  {...this.props.Strick.paramsObj, ...param }
      }
      this.props.dispatch({
        type: 'Strick/fetch',
        payload: sendParams,
      });
  }
    dataFetchSec(param){//请求2级接口
      let sendParams = {
        paramsObj2:  {...this.props.Strick.paramsObj2, ...param }
      }
      this.props.dispatch({
        type: 'Strick/getDetail',
        payload: sendParams,
      })
    }
     
    secDataGetFn(id){//获得二级列表
      let {startTime, endTime} = this.props.home.paramsObj;
      let {userid} = this.props;
      this.dataFetchSec({
        startTime:startTime,
        endTime:endTime,
        userId:userid,
        groupId:id
      })
       
    }
render() {
  const collegeTitle ={
    selfTaught:'学院 (自考)',
    barrier:'学院 (壁垒)',
    Incubator:'学院 (孵化器)',

  }
  const familyTitle = {
    selfTaught:'家族 (自考)',
    barrier:'家族 (壁垒)',
    Incubator:'家族 (孵化器)',

  }
 const groupTitle = {
    selfTaught:'小组 (自考)',
    barrier:'小组 (壁垒)',
    Incubator:'小组 (孵化器)',
  }
  const rgb={
      col:'rgba(82,201,194,0.15)',
      fam:'rgba(243,169,47,0.15)',
      gro:'rgba(97,155,222,0.15)'
  }
  const head_row = (rowData, sectionID, rowID) => {
    let n = rowData.groupType;
    let chain = rowData.chain;
    const header_info =(<div 
      onClick={()=>this.secDataGetFn(rowData.groupId)} 
      className="flex-container" 
      style={{width:'6.38rem', fontSize:'.2rem', height:'.8rem',background:n%3==1? rgb.col:n%3==2?rgb.fam:rgb.gro,padding:'0 0.32rem 0 0.28rem'}}>
      <Flex justify="around">
            <div>{rowData.category}</div>
            <div>{rowData.project}</div>
            <div>{rowData.rank}/{rowData.groupTotal}</div>
            <div>{rowData.score}<span className={chain==0?styles.circleY:chain<0?styles.circleR:styles.circleG}></span></div>
            <div>{rowData.group}</div>
            <div>{rowData.firstScore}</div>
            <img className={styles.arrow} src={n%3==1?greenIcon:n%3==2?yellowIcon:blueIcon}/>
       </Flex>
      </div>)
      return (
        <div key={rowID} style={{paddingBottom: '.14rem',fontSize:'.2rem' }}>
          <Accordion className="my-accordion">
            <Accordion.Panel header={header_info}>
              <List className={styles.mylist} prefixCls="mylist" style={{background: n%3==1?rgb.col:n%3==2?rgb.fam:rgb.gro}}>
                <List.Item prefixCls="mylist">
                  <ul className={styles.ulCss}>
                    <li>
                      <span className={styles.row1}> </span>
                      <span className={styles.row2}>正面均分</span>
                      <span className={styles.row2}>负面均分</span>
                    </li>
                   
                    {this.props.Strick.dataSecList==null?'loading...':Object.keys(this.props.Strick.dataSecList).map((key,i)=>{ 
                      let datalist = this.props.Strick.dataSecList[key][i];
                        return (<Link to="DataIndex" key={`row${i}`}>
                                <li>
                                  <span className={styles.row1}>{datalist.title}</span>
                                  <span className={styles.row3}>{datalist.positive}<i className={datalist.chain1==0?styles.circleY:datalist.chain1<0?styles.circleR:styles.circleG}></i></span>
                                  <span className={styles.row3}>{datalist.negative}<i className={datalist.chain==0?styles.circleY:datalist.chain<0?styles.circleR:styles.circleG}></i></span>
                                </li>
                              </Link>)
                        })
                  }
                  {/* <li>
                      <span className={styles.row1}>我的得分</span>
                      <span className={styles.row3}>2<i className={styles.circleG}></i></span>
                      <span className={styles.row3}>3<i className={styles.circleR}></i></span>
                    </li>
                    <li>
                      <span className={styles.row1}>集团第1名得分 <i style={{fontStyle:'normal', width: '100%',textAlign: 'center'}}>(搜狐)</i></span>
                      <span className={styles.row3}>2<i className={styles.circleY}></i></span>
                      <span className={styles.row3}>3<i className={styles.circleR}></i></span>
                    </li>
                     <li>
                      <span className={styles.row1}>通体得分<i style={{fontStyle:'normal',width: '100%',textAlign: 'center'}}>(gugu)</i></span>
                      <span className={styles.row3}>2<i className={styles.circleR}></i></span>
                      <span className={styles.row3}>3<i className={styles.circleY}></i></span>
                    </li>*/}
                  </ul>
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion>
        </div>
      );
    }
  return (
  <div>
    <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        className="am-list sticky-list"
        style={{background:'#fff'}}
        useBodyScroll
        renderSectionWrapper={sectionID => (
          <StickyContainer
            key={`s_${sectionID}_c`}
            className="sticky-container"
            style={{ zIndex: 4 }}
          />
        )}
        renderSectionHeader={sectionData => (
          <Sticky>
            {({
              style,
            }) => (
              <div
                className="sticky"
                style={{
                  ...style,
                  zIndex: 2,
                  lineHeight:'.8rem',
                  backgroundColor:sectionData.indexOf('college')==0? '#52C9C2':sectionData.indexOf('family')==0? '#F3A92F':'#619BDE',
                  color: 'white',
                  width:'6.38rem',
                  padding:'0 0.3rem',
                  height:'.8rem',
                  fontSize:'.2rem',
                  borderRadius:'.04rem .04rem 0 0'
                }}
              >
        				<Flex justify="around">
                    <div>
                      {
                        sectionData == 'collegeselfExam'?collegeTitle.selfTaught:
                        sectionData == 'collegebarrier'?collegeTitle.barrier:
                        sectionData == 'collegeincubator'?collegeTitle.Incubator:
                        sectionData == 'familyselfExam'?familyTitle.selfTaught:
                        sectionData == 'familybarrier'?familyTitle.barrier:
                        sectionData == 'familyincubator'?familyTitle.Incubator:
                        sectionData == 'groupselfExam'?groupTitle.selfTaught:
                        sectionData == 'groupbarrier'?groupTitle.barrier:
                        sectionData == 'groupincubator'?groupTitle.Incubator:''
                      }
                    </div>

        				      <div>项目</div>
        				      <div>排名 / 总数</div>
        				      <div>均分</div>
        				      <div>集团均分</div>
        				      <div>第一名</div>
        				 </Flex>
              </div>
            )}
          </Sticky>
        )}
        renderRow={head_row}
        pageSize={3}
        initialListSize={10}
        onScroll={() => { }}
        scrollEventThrottle={200}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
      <Link className={styles.seeAllCls} to="/CreditDetails">查看全部 ></Link>

      </div>
    );
  }
}
function mapStateToProps(Strick) {
  return Strick
}
export default connect(mapStateToProps)(Demo);