/*
* tableTitle，请确认是否删除以下数据：
* dataSource, 列表数据
* columns，列表列信息
* */
import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './step.less';

class stepTable extends Component {
  render() {
    const { tableTitle, onlyTable } = this.props;
    const dataSource = [];

    const columns = [];
    return (
      <div className={styles.tableWrap}>
        {tableTitle ? (
          <div className={onlyTable ? styles.centerTxt : styles.tableTitle}> {tableTitle} </div>
        ) : null}
        {dataSource ? (
          <div className={onlyTable ? styles.onlyTable : styles.tableList}>
            <Table bordered dataSource={dataSource} columns={columns} pagination={false} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default stepTable;
