import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Icon} from 'antd-mobile';
import commonStyle from './ChartCommonStyle.css';
import echarts from 'echarts';
import {circer_formater_shu, axis_name_haddle, echart_format_title} from '../../utils/echartsUtils';
import {fontSizeAuto} from "../../utils/fontSizeAuto";
import {getOrgMap} from '../../utils/dealWithOrg';
//传递来的数组数值轴数组
let myChart = {};

function grid_change(sort_arr) {       //改变画布的坐标位置尺寸的方法,当全部为负值是,将x轴向下平移60px
  return {
    left: fontSizeAuto(20),
    top: sort_arr[sort_arr.length - 1].value <= 50 ? fontSizeAuto(200) : fontSizeAuto(187)
  }
}


class BarEcharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
    }
  }

  setChartsOps(options_obj) {          //绘制图标方法
    const seriesData = options_obj['seriesData'] || [];
    const area_data = options_obj['area_data'] || [];
    const category_data = options_obj['category_data'] || [];
    return {
      tooltip: {
        trigger: 'axis',
        position: 'right',
      },
      title: {
        top: fontSizeAuto(25),
        left: fontSizeAuto(18),
        text: options_obj.title,
        textStyle: {
          color: '#444348',
          fontSize: fontSizeAuto(26),
        },
      },
      legend: {
        left: fontSizeAuto(279),
        top: fontSizeAuto(70),
        selectedMode: false,     //禁止点击图例
        data: [{
          name: `集团均分 ${options_obj.companyScore}`,
          icon: "emptyCircle",
          textStyle: {
            color: '#999999',
            fontSize: fontSizeAuto(18),
          },
        }],
      },
      grid: {
        containLabel: true,    //此属性用于设置名字太长显示不全
        left: fontSizeAuto(20),
        top: fontSizeAuto(252),
        // ...options_obj.grid_ops,
      },
      xAxis: [{
        type: 'category',
        axisTick: {
          show: false,
        },
        z: 2,
        axisLabel: {
          color: '#999999',
          fontSize: fontSizeAuto(12),
          rotate: 45,

        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#DADADA',
          },

        },
        data: category_data,
      }],
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#8C8C8C',
          fontSize: '16px',
        },
        axisLine: {
          show: false,
        },
        splitLine: {     //分割线
          show: true,
          lineStyle: {
            color: '#EEEEEE',
            width: 1,
          },

        },
      },
      series: [
        {
          name: `集团均分 ${options_obj.companyScore}`,   //动态获取
          type: 'bar',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          barGap: '40%',
          z: 4,
          markLine: {        //设置集团均分值
            silent: true,     //鼠标不触发
            symbol: '',
            label: {          //标记线的显示
              show: false,
            },
            data: [
              {type: 'average', name: '平均值'},
            ],
            lineStyle: {
              color: '#4A90E2',
            },

          },
          tooltip: {
            show: false,
          },
          barWidth: fontSizeAuto(20),
          data: seriesData,
        }, {
          type: 'bar',
          barGap: '-100%',
          itemStyle: {
            normal: {
              show: true,
              color: '#EDF9F8',
            },
          },
          tooltip: {
            show: false,
          },
          silent: true,    //阻止掉事件
          barWidth: fontSizeAuto(20),
          data: area_data,
        },
      ]


    }
  }

  drawChart(nextProps = this.props) {
    myChart[this.props.chartName].clear();
    const ops_obj = this.dataHandle(nextProps);//处理数据并返回图标所需要的数据格式用于显示
    myChart[this.props.chartName].setOption(ops_obj);
  }

  dataHandle(nextProps) {     //数值数组的处理方法
    const XG_data = getOrgMap(nextProps.index.organization[nextProps.chartName], nextProps.paramsObj.groupType).map((item) => (item.id)); //用户相关id数组
    const dataBase = nextProps.data;
    const chartData = nextProps.data.data;
    const area_data = [];        //用于处理柱状图延伸区域
    const options_data = [];
    const sort_arr = chartData.sort(function (a, b) {
      return a.val - b.val;
    });
    chartData.forEach(function (item) {
      let isXiangguan = XG_data.indexOf(item.key) >= 0;
      let ops_obj = {
        value: item.val,
        label: {
          show: true,
          color: '#333333',
          position: item.val > 0 ? 'top' : 'bottom',
          ...circer_formater_shu(item.chain),       //根据需求传入颜色
        },
        itemStyle: {
          color: isXiangguan ? '#FDBF41' : '#52C9C2',
          barBorderRadius: item.val > 0 ? [3, 3, 0, 0] : [0, 0, 3, 3],     //处理数据正副职圆角的问题
        },
      };
      options_data.push(ops_obj);     //添加设置echarts参数
      area_data.push(
        {
          value: item.val < 0 ? sort_arr[0]['val'] - 10 : sort_arr[sort_arr.length - 1]['val'] + 10,
          label: {
            show: true,
            position: item.val > 0 ? 'bottom' : 'top',
            offset: item.val > 0 ? [0, 0] : [-10, 10],
            rotate: -45,
            ...axis_name_haddle(isXiangguan ? '#FDBF41' : '#999999', item.name),

          }
        }
      );
    });
    return this.setChartsOps({
      seriesData: options_data,
      area_data: area_data,
      title: echart_format_title(nextProps.paramsObj, nextProps.chartName),
      companyScore: dataBase.companyScore,
      grid_ops: grid_change(sort_arr),   //处理全部为负值的情况
    });
  }


  undateChart() {     //更新画布
    myChart[this.props.chartName] === null && this.initChart();
    this.drawChart();
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
    console.log(this)
    setTimeout(function () {
      self.initChart();
      self.drawChart();
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.paramsObj) !== JSON.stringify(this.props.paramsObj)) {      //接口出来后应该按照data进行判断
      this.drawChart(nextProps);
    }
  }
  render() {
    return (
      <div className={commonStyle.echartsBox}>
        <Link className={commonStyle.btnEcharts} to="/CreditDetails"><Icon type='right' className={commonStyle.echartsIcon} size="lg"/></Link>
        <div id={this.props.chartName} style={{width: '7.1rem', height: '450px'}}></div>
      </div>
    )
  }
}


export default connect((stage) => (stage))(BarEcharts);
