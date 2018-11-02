/* IntervalItem组件参数介绍:
*
* dataSource{必传 Obj}:数据源，对象结构:{v1:xx,v2:xx，percent:1/2}
* v1:为数据
* v：true/false:为checkbox的checked值为false还是true回显用的
* percent:1是带%数据v1需要乘以100，2是不带%
*
* */

import React, { Component } from 'react';
import { Checkbox } from 'antd';
import styles from './CoefficientDetail.less';

class IntervalItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  coefficient = (v1, v2,percent) => {
    console.log(v1, v2,percent)
    const val1 =percent === 1?v1*100:v1
    const bol = true
    return (
      <span>
        <span className={styles.firstCoeSpan}>{val1}{percent===1?' %':null}</span>
        <Checkbox  disabled checked={v2?bol:false} className={styles.checkBoxCls} />
        <span className={styles.word}>闭区间</span>
      </span>);
  };

  render() {
    const {v1=0,v2=true,percent=1}=this.props;
    return (
      <span>
        {this.coefficient(v1,v2,percent)}
      </span>);
  }
}

export default IntervalItem;
