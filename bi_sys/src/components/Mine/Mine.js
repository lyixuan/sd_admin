import React, {Component} from 'react';
import {connect} from 'dva';
import styles from './Mine.css';
import {Flex, Tabs, SegmentedControl, Calendar} from 'antd-mobile';
import Select, {Option} from 'rc-select';
import 'rc-select/assets/index.css';
import ChartContainer from '../Chart/ChartContainer';
import {monthMean, weekMean, formatDate} from '../../utils/FormatDate';
import 'antd-mobile/dist/antd-mobile.css';//暂时使用

const now = new Date();

class Mine extends Component {
  originbodyScrollY = document.getElementsByTagName('body')[0].style.overflowY;

  constructor(props) {
    super(props);
    this.state = {
      showTimeModel: false,
      creditShowType: 'rank',
      tabKey: 1
    };
  }

  componentDidMount() {
    let sendParams = {
      paramsObj: {...this.props.home.paramsObj},
      creditShowType: this.state.creditShowType,
    }
    this.props.dispatch({
      type: 'home/fetchRank',
      payload: sendParams,
    });

  }

  fnGetData(ops) {        //用于数据的请求
    //排名和趋势参数不用于请求数据,需要过滤出来
    let iscreditShowType = ops.hasOwnProperty('creditShowType');
    let sendParams = {
      paramsObj: iscreditShowType ? {...this.props.home.paramsObj, ...ops.rankType} : {...this.props.home.paramsObj, ...ops},
      creditShowType: iscreditShowType ? ops['creditShowType'] : this.props.home.creditShowType,
    };
    this.props.dispatch({
      type: sendParams.creditShowType === 'rank' ? 'home/fetchRank' : 'home/fetchTrend',
      payload: sendParams,
    });
  }

  onSelect = (value) => {    //周均月均自定义时间选择器
    Number(value) === 1 && this.fnGetData({...weekMean(now), dataType: value});
    Number(value) === 2 && this.fnGetData({...monthMean(now), dataType: value});
    Number(value) === 3 && this.setState({showTimeModel: true,});
  }
  // onSelectCreditType = (tab) => {
  //   this.fnGetData({creditType: tab.creditType})
  // }
  onSelectedGroupType = (tab, index) => {
    let rankType = tab.groupType !== 1 && this.props.home.creditShowType === 'rank' ? 1 : 3;      //重写排名顺序,默认是集团排名
    this.fnGetData({groupType: tab.groupType, rankType});
  }
  onSelectRank = (value) => {    //排名类型
    value !== this.props.home.paramsObj.rankType && this.fnGetData({rankType: value});
  }
  onValueChange = (value) => {
    let creditShowType = value === '排名' ? 'rank' : value === '趋势' ? 'trend' : null;
    let rankType = value === '排名' && this.props.home.paramsObj.groupType !== 1 ? 1 : 3;      //重写排名顺序,默认是集团排名
    // this.setState({
    //   rankType: 3,
    // });

    this.fnGetData({creditShowType, rankType});

  }


  onConfirm = (startTime, endTime) => {     //时间空间确认按钮
    this.fnGetData({startTime: startTime.valueOf(), endTime: endTime.valueOf(), dataType: 3});
    this.setState({
      showTimeModel: false,
    });
  }

  onCancel = () => {                        //时间空间关闭按钮
    this.setState({
      showTimeModel: false,
    });
  }

  fnCLickTab(tab) {     //点击tab方法
    this.fnGetData({creditType: tab});
    this.setState({
      tabKey: tab,
    });

  }

  renderTimeBtn(zh) {       //打开时间空间方法
    return (
      <span onClick={() => (this.setState({showTimeModel: true}))}>{zh}</span>
    )
  }


  render() {
    const paramsObj = this.props.home.paramsObj || {
      startTime: weekMean(new Date()).startTime,
      endTime: weekMean(new Date()).endTime,
      creditType: 1,
      groupType: 1,
      rankType: 3,
      dataType: 1,
    };
    const {rankDataObj, trendDataObj, creditShowType, companyAvgDataObj,firstMeanObj} = this.props.home;
    const TabContent1 = () => {
      return (<div
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.26rem', height: '.86rem'}}>
        <Tabs tabs={groupTypeTab}
              tabBarActiveTextColor={'#52C9C2'}
              tabBarInactiveTextColor={'#999'}
              tabBarUnderlineStyle={{display: 'none'}}
              tabBarTextStyle={{fontSize: '.26rem'}}
              initialPage={paramsObj.groupType - 1}
              animated={false}
              onChange={this.onSelectedGroupType}
        >
          <div className={styles.tabContent}>

          </div>
          <div>
            <div className={styles.tabConBox}>
              <div>
                <span onClick={this.onSelectRank.bind(this, 1)}
                      style={paramsObj.rankType === 1 ? {color: '#52C9C2'} : {color: '#999'}}>集团排名</span>
                <b className={styles.tabConTip}>|</b>
                <span onClick={this.onSelectRank.bind(this, 2)}
                      style={paramsObj.rankType === 2 ? {color: '#52C9C2'} : {color: '#999'}}>院内排名</span>
              </div>
            </div>
            <div className={styles.tabContentTxt}>

            </div>


          </div>
          <div>
            <div className={styles.tabConBox}>
              <div>
                <span onClick={this.onSelectRank.bind(this, 1)}
                      style={paramsObj.rankType === 1 ? {color: '#52C9C2'} : {color: '#999'}}>集团排名</span>
                <b className={styles.tabConTip}>|</b>
                <span onClick={this.onSelectRank.bind(this, 2)}
                      style={paramsObj.rankType === 2 ? {color: '#52C9C2'} : {color: '#999'}}>院内排名</span>
              </div>
            </div>
            {/*<div className={styles.tabContentTxt}>*/}

            {/*</div>*/}


          </div>
        </Tabs>
      </div>)

    }
    const TabContent2 = () => {
      return (<div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '.26rem',
          height: '.86rem'
        }}>

          <Tabs tabs={groupTypeTab}
                initialPage={paramsObj.groupType - 1}
                tabBarActiveTextColor={'#52C9C2'}
                tabBarInactiveTextColor={'#999'}
                tabBarUnderlineStyle={{display: 'none'}}
                tabBarTextStyle={{fontSize: '.26rem'}}
                style={{padding: '0 .3rem', borderBottom: '.02rem solid #fff'}}
                animated={false}
                onChange={this.onSelectedGroupType}/>

        </div>
      )
    }

    const groupTypeTab = [
      {title: '学院', groupType: 1},
      {title: '家族', groupType: 2},
      {title: '小组', groupType: 3},
    ];
    return (
      <div className={styles.normal} id="dataCenter">
        <Flex align="end" style={{height: '.5rem', padding: '0 0.3rem', backgroundColor: '#fff'}}>
          <p className={styles.data_title}>数据中心</p>
          <p className={styles.data_tip}>每天00:00发布最新数据</p>
        </Flex>

        <Flex justify="arround"
              style={{height: '0.56rem', padding: '0.28rem 0.3rem 0.38rem', backgroundColor: '#fff'}}>
          <p
            className={styles.data_date}>{`${formatDate(paramsObj.startTime)}-${formatDate(paramsObj.endTime)}`}</p>

          <div className={styles.selectCls}>
            <Select
              defaultValue="周均数据"
              optionLabelProp="children"
              style={{width: "1.88rem", height: '.56rem'}}
              onChange={this.onSelect}
            >
              <Option value="1">周均数据</Option>
              <Option value="2">月均数据</Option>
              <Option value='3'>{this.renderTimeBtn('自定义数据')}</Option>
            </Select>
          </div>
        </Flex>

        {/*均分类型tab*/}

        <div className={styles.bgColor}>
          <div className={styles.tabBox}>
            <span className={`${styles.tabBtn} ${this.state.tabKey === 1 ? styles.sectedBtn : ''}`}
                  onClick={() => (this.fnCLickTab(1))}>学分均分</span>
            <span className={`${styles.tabBtn} ${this.state.tabKey === 2 ? styles.sectedBtn : ''}`}
                  onClick={() => (this.fnCLickTab(2))}>正面均分</span>
            <span className={`${styles.tabBtn} ${this.state.tabKey === 3 ? styles.sectedBtn : ''}`}
                  onClick={() => (this.fnCLickTab(3))}>负面均分</span>
          </div>
        </div>

        <div className={styles.classifycls}>
          <SegmentedControl
            values={['排名', '趋势']}
            className={styles.myStyle}
            tintColor={'#52C9C2'}
            selectedIndex={creditShowType === 'rank' ? 0 : 1}
            onValueChange={this.onValueChange}
          />
        </div>
        {
          creditShowType === 'rank' ?
            <TabContent1/> : <TabContent2/>
        }
        {/*添加一个组件用于无数据处理*/}

        <div style={{border: '0.2rem', boxSizing: 'border-box', background: "#F4F4F6"}}>
          {JSON.stringify(rankDataObj) === '{}' ? <div className={styles.normal}>添加loading</div> :
            <ChartContainer data={creditShowType === 'rank' ? rankDataObj : trendDataObj} paramsObj={paramsObj}
                            creditShowType={creditShowType} companyAvgDataObj={companyAvgDataObj} firstMeanObj={firstMeanObj}/>}
        </div>


        <Calendar
          visible={this.state.showTimeModel}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          getDateExtra={this.getDateExtra}
          defaultDate={now}
          minDate={new Date(+now - 5184000000)}
          maxDate={new Date(+now + 31536000000)}
        />
      </div>
    );
  }
}

export default connect(({home}) => ({home}))(Mine);
