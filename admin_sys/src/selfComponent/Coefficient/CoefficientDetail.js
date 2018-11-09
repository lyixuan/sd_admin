/* CoefficientDetail组件参数介绍:
*
* dataSource{必传 Obj}:数据源，对象结构:{data:[{v1:xx,v2:xx,v3:xx,v4:xx,v5:xx}.....],key:1/2,percent:1/2,basic:1/2}
* 里面有要map遍历的data数据源，data为数组格式，里面为对象itme;
* compo:1代表闭区间的组件，2为title:value格式的组件
* percent:1代表有%，2无%分号
* basic:1基数，后面带有'元'的单位，2为系数，后面不带有单位
*
* */

import React, { Component } from 'react';
import { Checkbox } from 'antd';
import styles from './CoefficientDetail.less';

class CoefficientDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  spanFun = data => {
    const val = data.map(item => {
      return (
        <div key={item.key}>
          <span className={styles.groupSpan}>
            组内老师人数：<span>{item.v1}</span>
          </span>
          <span className={styles.groupSpan1}>
            运营长绩效：<span>{parseFloat((item.v2 * 100).toPrecision(12))}%</span>
          </span>
          <span className={styles.groupSpan2}>
            班主任绩效：<span>{parseFloat((item.v3 * 100).toPrecision(12))}%</span>
          </span>
        </div>
      );
    });
    return val;
  };

  IntervalItem = (v1 = 0, v2 = false, percent) => {
    const val1 =
      percent === 1 ? (v1 * 100 > 100 ? 100 : parseFloat((v1 * 100).toPrecision(12))) : v1;
    const bol = true;
    return (
      <span>
        <span className={styles.firstCoeSpan}>
          {val1}
          {percent === 1 ? ' %' : null}
        </span>
        <Checkbox disabled checked={v2 ? bol : false} className={styles.checkBoxCls} />
        <span className={styles.word}>闭区间</span>
      </span>
    );
  };

  coefficient = (data, percent, basic) => {
    const val = data.map(item => {
      return (
        <div key={item.key} className={styles.coeffiDiv}>
          {this.IntervalItem(item.v1, item.v2, percent)}
          <span className={styles.xSpin}>～</span>
          {this.IntervalItem(item.v3, item.v4, percent)}
          {basic === 1 ? (
            <span className={styles.basicSpan}> 基数：{item.v5} 元</span>
          ) : (
            <span className={styles.basicSpan}>系数：{item.v5}</span>
          )}
        </div>
      );
    });
    return val;
  };

  render() {
    const { dataSource = {} } = this.props;
    const { data = [], compo = 1, percent = 1, basic = 1 } = dataSource;
    return (
      <div>
        {compo === 2 ? (
          <div>{this.spanFun(data)}</div>
        ) : (
          <div>{this.coefficient(data, percent, basic)}</div>
        )}
      </div>
    );
  }
}

export default CoefficientDetail;
