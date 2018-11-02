/* CoefficientDetail组件参数介绍:
*
* dataSource{必传 Obj}:数据源，对象结构:{data:[{v1:xx,v2:xx,v3:xx,v4:xx,v5:xx}.....],key:1/2,percent:1/2,basic:1/2}
* 里面有要map遍历的data数据源，data为数组格式，里面为对象itme;
* key:1代表闭区间的组件，2为title:value格式的组件
* percent:1代表有%，2无%分号
* basic:1基数，后面带有'元'的单位，2为系数，后面不带有单位
*
* */

import React, { Component } from 'react';
import IntervalItem from './IntervalItem';

// import styles from './CoefficientDetail.less';

class CoefficientDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  spanFun = (data) => {
    const val = data.map(item => {
      return (
        <div key={item.id} >
          <span>组内老师人数：{item.v1}</span>;
          <span>运营长绩效：{item.v2*100}%</span>;
          <span>班主任绩效：{item.v3*100}%</span>;
        </div>
      );
    })
    return val;
  };

  coefficient = (data, percent,basic) => {
   const val = data.map(item => {
      return (
        <div key={item.id} >
          <IntervalItem
            v1={item.v1}
            v2={item.v2}
            percent={percent}
          />
          <span>～</span>
          <IntervalItem
            v1={item.v3}
            v2={item.v4}
            percent={percent}
          />
          {basic===1?(<span>基数：{item.v5} 元</span>):(<span>系数：{item.v5}</span>)}
        </div>
      );
    })
    return val;
  };

  render() {
    const { dataSource = {} } = this.props;
    const {data=[],key=1,percent=1,basic=1}=dataSource;
    return (
      <div>
        {key===2?(<div>{this.spanFun(data)}</div>):(
          <div>
            {this.coefficient(data,percent,basic)}
          </div>)
        }
      </div>);
  }
}

export default CoefficientDetail;
