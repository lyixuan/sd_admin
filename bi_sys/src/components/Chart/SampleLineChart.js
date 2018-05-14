import React from 'react';
import styles from './SampleLineChart.css';
import echarts from 'echarts'
import {fontSizeAuto} from "../../utils/fontSizeAuto";
import {connect} from 'dva';

let myChart = null;

class SampleLineChart extends React.Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   dementionId:this.props.dementionId,
    //   fetchdata1:this.props.fetchdata1,
    // }
  }

  dataHandle(datasource) { //通过dementionId遍历接口获得button的title
    const titledata = datasource.fetchdata1;
    const result = []
    titledata.map(function(item, index) {
      if(item.id == datasource.dementionId)
      {
          const titleitem = {
              nametitle: item.name,
              secondtitle: item.rawDataDes,
          } 
          result.push(titleitem)
      }
    })
    return result;
  }
//初始化ecahrt
  initEchart() {
    myChart = echarts.init(document.querySelector('.sampleLineChart'));
  }
//设置数据添加到echart中
  setChartsOps(datasource) {
    const titleobj = this.dataHandle(datasource).length==0?[{name:"返回空",secondtitle:"空"}]:this.dataHandle(datasource);
    const nameTitle = titleobj[0].nametitle;
    const rawDataDes= titleobj[0].secondtitle;
    const xdata = [];
    const ydata = [];
    console.log(datasource)
    if(datasource.chartdata2.data == null){
      const test=[
        {key:'5.20',val:1},
        {key:'5.21',val:10},
        {key:'5.22',val:2},
        {key:'5.23',val:7},
        {key:'5.24',val:2},
        {key:'5.25',val:7},
      ]
      test.map(function(item, index) {
        const xvalue = item.key;
        const value = item.val
        xdata.push(xvalue)
        ydata.push(value)
      } )
    }else{
      datasource.map(function(item, index) {
        const xvalue = item.key;
        const value = item.val
        xdata.push(xvalue)
        ydata.push(value)
      } )
    }
    
    return {
      title: {
        text: nameTitle,
        subtext: rawDataDes,
        top: fontSizeAuto(38),
        left: fontSizeAuto(24),
        textStyle: {
          fontSize: fontSizeAuto(24),
          color: '#444348',
        }
      },
      grid: {
        top: fontSizeAuto(143),
        left: fontSizeAuto(25),
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
        data: xdata,
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
      series: {
        name: '集团第一名均分',
        type: 'line',
        symbol: 'circle', // 拐点样式 圆
        symbolSize: fontSizeAuto(10), // 拐点大小
        // 拐点
        itemStyle: {
          color: '#52C9C2',
        },
        lineStyle: {
          color: '#52C9C2',
          type: 'solid', // 实线
        },
        data: ydata
      }
    }
  }

  drawChart(nextProps = this.props) {
    const obj_ops = this.setChartsOps(nextProps);
    myChart.setOption(obj_ops)
  }

  componentDidMount() {
    const self=this;
    setTimeout(function(){
      self.initEchart();
      self.drawChart();
    },300)
  }

  //父组件的props改变，则子组件数据要跟着改变
  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.dementionId)!==JSON.stringify(this.props.dementionId)){
      // this.setState({
      //   dementionId:nextProps.dementionId,
      //   fetchdata1:nextProps.fetchdata1,
      // });
      this.drawChart(nextProps)
    }
  }

  render() {
    return (
      <div className='sampleLineChart'
           style={{width: '7.1rem', background: '#FFFFFF', height: '6rem', margin: '0 auto', borderRadius: '5px'}}>
        图标正在加载中...
      </div>
    );
  }
}

function mapStateToProps(dataIndex) {
  return dataIndex;
}

export default connect(mapStateToProps)(SampleLineChart)
