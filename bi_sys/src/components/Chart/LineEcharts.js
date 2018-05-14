import React from 'react';
import echarts from 'echarts';
import {Link} from 'dva/router';
import {Icon} from 'antd-mobile';
import commonStyle from './ChartCommonStyle.css';
import GroupList from '../GroupList';
import {fontSizeAuto} from "../../utils/fontSizeAuto";
import {echart_format_title} from '../../utils/echartsUtils';

let myChart = {};


class LineEcharts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: null,
    }


  }

  setChartsOps(options_obj) {          //绘制图标方法
    return {
      title: {
        text: '学分均分-学院（自考）',
        top: fontSizeAuto(20),
        left: fontSizeAuto(20),
        textStyle: {
          fontSize: fontSizeAuto(26),
          color: '#444348',
        }

      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.6)',
        // textStyle:{
        //   fontSize: fontSizeAuto(16),
        //   color:'#FFFFFF',
        //   height:20,
        //   lineHeight:fontSizeAuto(28)
        //
        // }
      },
      legend: [{
        // left: fontSizeAuto(147),
        top: fontSizeAuto(82),
        data: [
          {name: '集团均分'},
          {name: `均分排名第一: ${options_obj.firstGroupName}`}],
        itemGap: 0,    //图例之间的距离
        textStyle: {
          color: '#999999',
          fontSize: fontSizeAuto(18),
        },
      }],
      grid: {
        top: fontSizeAuto(188),
        left: fontSizeAuto(20),
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: fontSizeAuto(16),
          color: '#8C8C8C',
        },
        data: options_obj.dateArr,
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: fontSizeAuto(16),
          color: '#8C8C8C',
        },
      },
      series: [{
        type: 'line',
        name: '集团均分', // 上边两个图例
      }, {
        type: 'line', // 上边两个图例
        name: `均分排名第一: ${options_obj.firstGroupName}`,
      },
        // 正式数据
        {
          name: '集团均分',
          type: 'line',
          symbol: 'circle', // 拐点样式 圆
          symbolSize: fontSizeAuto(10), // 拐点大小
          // 拐点
          itemStyle: {
            color: '#3389FF',
          },
          // 线段
          lineStyle: {
            type: 'dashed',
            color: '#3389FF',
          },
          z: 2,
          data: options_obj['companyGroup'],
        },
        {
          name: '集团第一名均分',
          symbol: 'circle', // 拐点样式 圆
          symbolSize: fontSizeAuto(10), // 拐点大小
          // 拐点
          itemStyle: {
            color: '#FED15A',
          },
          // 线段
          type: 'line',
          lineStyle: {
            color: '#FED15A',
            type: 'solid', // 实线
          },
          z: 1,
          data: options_obj['firstMean'],
        },
        {
          name: '学院均分',
          symbol: 'circle', // 拐点样式 圆
          symbolSize: fontSizeAuto(10), // 拐点大小
          // 拐点
          itemStyle: {
            color: '#52C9C2',
          },
          // 线段
          type: 'line',
          lineStyle: {
            color: '#52C9C2',
            type: 'solid', // 实线
          },
          z: 3,
          data: options_obj['group'],
          tooltip: {
            backgroundColor: "red"
          }
        },
      ]
    };
  }

  drawChart(nextProps = this.props) {
    myChart[this.props.chartName].clear();
    const ops_obj = this.dataHandle(nextProps);//处理数据并返回图标所需要的数据格式用于显示
    myChart[this.props.chartName].setOption(ops_obj);
  }

  dataHandle(nextProps) {      //数据处理方法
    const companyCreditObj = nextProps.companyAvgDataObj;   //集团排名数据
    const firstMeanObj=nextProps.firstMeanObj;              //排名第一数据
    const dataBase = nextProps.data;
    const chartData = nextProps.data.data;
    const groupData = [];     //所属均值
    const companyGroup = [];    //集团均值
    const firstMean = [];       //集团第一
    const dateArr = [];      //时间数组;
    if(chartData.length!==companyCreditObj.data.length){
      console.warn('折现数据异常')

    }
    chartData.forEach(function (item, index) {
      companyGroup.push(companyCreditObj.data[index].val);
      firstMean.push(firstMeanObj.data[index].val);
      groupData.push(item.val);
      dateArr.push(item.date);

    });
    return this.setChartsOps({
      title: echart_format_title(nextProps.paramsObj, nextProps.chartName),
      dateArr: dateArr,
      firstGroupName: dataBase.title,
      companyGroup: companyGroup,     //集团数据
      firstMean: firstMean,             //均分第一名
      group: groupData,                   //个人均分
    });
  }

  initChart() {
    const self = this;
    myChart[this.props.chartName] = echarts.init(document.getElementById(this.props.chartName));
    window.addEventListener("resize", function () {
      setTimeout(function () {
        self.drawChart();
      }, 100);
    });
    return myChart[this.props.chartName];
  }
  componentDidMount() {
    const self = this;
    setTimeout(function () {
      self.initChart();
      self.drawChart();
    }, 100);

  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {      //接口出来后应该按照data进行判断
      this.drawChart(nextProps);
    }
  }

  render() {
    return (
      <div className={commonStyle.echartsBox}>
        <Link className={commonStyle.btnEcharts} to="/CreditDetails"><Icon type='right'
                                                                           className={commonStyle.echartsIcon}
                                                                           size="lg"/></Link>
        <div id={this.props.chartName} style={{height: '400px', background: '#FFFFFF'}}></div>
        <GroupList/>
      </div>
    )
  }
}


export default LineEcharts;
