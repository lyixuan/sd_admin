import React from 'react';
import {Icon} from 'antd-mobile';
import echarts from 'echarts';
import styles from './ChartContainer.css';
import commonStyle from './ChartCommonStyle.css';
import BarEcharts from './BarEcharts';
import HengBarEcharts from './HengBarEcharts';
import LineEcharts from './LineEcharts';


class ChartContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      beginDrawChart: false,
    }


  }

  componentDidMount() {
    if (this.props.data) {      //父组件传值后渲染
      this.setState({
        beginDrawChart: true
      })

    }
  }
  render() {
    if (this.state.beginDrawChart) {        //防止重绘影响性能
      const {data, paramsObj, creditShowType, companyAvgDataObj,firstMeanObj} = this.props;
      const selfExamChart = (chartName) => {
          if (data[chartName] !== undefined && data[chartName]['data'] !== undefined) {
            if (creditShowType === 'rank' && data[chartName]['data'] > 10) {
              return (
                <HengBarEcharts chartName={chartName} data={data[chartName]} paramsObj={paramsObj} key={chartName}/>)
            } else if (creditShowType === 'rank' && data[chartName]['total'] <= 10) {
              return (<BarEcharts chartName={chartName} data={data[chartName]} paramsObj={paramsObj} key={chartName}/>)
            } else {
              return (<LineEcharts chartName={chartName} data={data[chartName]} paramsObj={paramsObj} key={chartName}
                                   companyAvgDataObj={companyAvgDataObj[chartName]} firstMeanObj={firstMeanObj[chartName]}/>)
            }
          } else ''
      }
      return (
        <div className={styles.normal}>
          {selfExamChart('selfExam')}
          {selfExamChart('barrier')}
          {selfExamChart('incubator')}
        </div>

      )
    } else {
      return (null)
    }
  }

}

export default ChartContainer;
