/*
* totalSize
* successSize
* failSize
* */
import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from './step.css';

class CheckResult extends Component {
  render() {
    const { totalSize, successSize, failSize } = this.props;
    return (
      <div>
        <span>校验数据总数：</span>
        <span className={styles.totalColor}>{totalSize} </span>
        <span className={styles.marRight_50}>条数据</span>
        <Icon type="check-circle" className={styles.sucessColor} />
        <span> 成功：</span>
        <span className={styles.sucessColor}>{successSize} </span>
        <span className={styles.marRight_50}>条</span>
        <Icon type="close-circle" className={styles.failColor} />
        <span> 失败：</span>
        <span className={styles.failColor}>{failSize} </span>
        <span>条</span>
      </div>
    );
  }
}

export default CheckResult;
