import React from 'react';
import {connect} from 'dva';
import {Icon} from 'antd-mobile';
import commonStyle from './ChartCommonStyle.css';
import echarts from 'echarts';
import {routerRedux, Link} from 'dva/router'
import {fontSizeAuto} from "../../utils/fontSizeAuto";
import {getOrgMap} from '../../utils/dealWithOrg';


import {
  circer_formater_heng,
  axis_name_haddle_nobreak,
  echart_format_title
} from '../../utils/echartsUtils';

//传递来的数组数值轴数组
let myChart = {};

class HengBarEcharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
    }
  }

  setChartsOps(options_obj) {          //绘制图标方法
    const area_data = options_obj['area_data'] || [];
    const seriesData = options_obj['seriesData'] || [];
    const category_data = options_obj['category_data'] || [];
    return {
      tooltip: {
        trigger: 'axis',
        position: 'right',
      },
      title: {
        top: fontSizeAuto(25),
        left: fontSizeAuto(18),
        text: options_obj.title || '',
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
          name: `集团均分 ${options_obj.junfen || ''}`,
          icon: "emptyCircle",
          textStyle: {
            color: '#999999',
            fontSize: fontSizeAuto(18),
          },
        }],
      },
      grid: {
        containLabel: true,    //此属性用于设置名字太长显示不全
        top: fontSizeAuto(167),
        left: -40,
      },
      xAxis: [{
        type: 'value',
        axisTick: {
          show: false,
        },
        z: 2,
        axisLabel: {
          color: '#8C8C8C',
          fontSize: fontSizeAuto(16),

        },
        axisLine: {
          show: true,
          lineStyle: {
            color: ' #EEEEEE',
          },

        },
        data: category_data,
      }],
      yAxis: {
        type: 'category',
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
          name: `集团均分 ${options_obj.junfen}`,   //动态获取
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
        },
        {
          type: 'bar',
          barGap: '-100%',
          tooltip: {
            show: false,
          },
          label: {},
          silent: true,    //阻止掉事件
          barWidth: fontSizeAuto(20),
          data: area_data,
        },
      ]
    }


  }


  dataHandle(nextProps) {      //数据处理方法
    const XG_data = getOrgMap(nextProps.index.organization[nextProps.chartName], nextProps.paramsObj.groupType).map((item) => (item.id)); //用户相关id数组
    const dataBase = nextProps.data;
    const chartData = nextProps.data.data;
    const area_data = [];        //用于处理柱状图延伸区域
    const options_data = [];

    const sort_arr = chartData.sort(function (a, b) {
      return a.val - b.val;
    });
    chartData.forEach(function (item, index) {
      const isEguaHuanbi = true
      let isXiangguan = XG_data.indexOf(item.groupId) >= 0;
      let ops_obj = {
        value: item.val,
        label: {
          show: true,
          color: '#333333',
          position: item.val > 0 ? 'inside' : 'inside',
          offset: item.val > 0 ? [40, 0] : [-20, 0],
          ...circer_formater_heng(item.chain, item.rankNum, fontSizeAuto(16)),       //根据需求传入颜色    indexde 值需要处理
        },
        itemStyle: {
          color: isXiangguan ? '#FDBF41' : '#52C9C2',
          barBorderRadius: item.val > 0 ? [0, 3, 3, 0] : [3, 0, 0, 3],     //处理数据正副职圆角的问题
        },
      };
      options_data.push(ops_obj);     //添加设置echarts参数
      area_data.push(
        {
          value: item.val < 0 ? sort_arr[0]['val'] - 10 : sort_arr[sort_arr.length - 1]['val'] + 10,
          itemStyle: {
            show: true,
            color: isXiangguan ? '#FEF8EC' : '#EDF9F8',
          },
          label: {
            show: true,
            textStyle: {
              fontSize: fontSizeAuto(16),
            },
            position: item.val > 0 ? 'left' : 'right',
            // offset: item.value > 0 ? [0, 0] : [0, 0],
            // rotate: -45,
            ...axis_name_haddle_nobreak(isEguaHuanbi ? '#FDBF41' : '#999999', item.key, fontSizeAuto(18)),
          }
        }
      );
    });
    return this.setChartsOps({
      seriesData: options_data,
      area_data: area_data,
      title: echart_format_title(nextProps.paramsObj, nextProps.chartName),
      junfen: dataBase.companyScore,
    })

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

  drawChart(nextProps = this.props) {
    myChart[this.props.chartName].clear();
    const ops_obj = this.dataHandle(nextProps);//处理数据并返回图标所需要的数据格式用于显示
    myChart[this.props.chartName].setOption(ops_obj);
  }

  componentDidMount() {
    const self = this;
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

  nextPage() {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/ChartsList',
        state: {
          chartName:this.props.chartName,
          data:this.props.data,
          paramsObj:this.props.paramsObj,
        },
      })
    );
  }

  render() {
    return (
      <div className={commonStyle.echartsBox}>
        <Link className={commonStyle.btnEcharts} to="/CreditDetails">
          <Icon type='right' className={commonStyle.echartsIcon} size="lg"/></Link>
        <div id={this.props.chartName} style={{width: '7.1rem', height: '400px'}}></div>
        {!this.props.isShowtoggleBtn ? (
          <div className={commonStyle.checkAllGroup} style={{marginTop: '-40px'}} onClick={this.nextPage.bind(this)}>
              <span className={commonStyle.toggleText}>
                查看全部
              </span>
          </div>
        ) : ''}

      </div>


    )
  }
}

export default connect((stage) => (stage))(HengBarEcharts);
