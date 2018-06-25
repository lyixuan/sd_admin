/*
* tableTitle，请确认是否删除以下数据：
* dataSource, 列表数据
* columns，列表列信息
* */
import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './step.css';

class stepTable extends Component {
  render() {
    const { dataSource, columns, tableTitle, onlyTable } = this.props;
    return (
      <div className={styles.tableWrap}>
        {tableTitle ? <div className={styles.tableTitle}> {tableTitle} </div> : null}
        {dataSource ? (
          <div className={onlyTable ? styles.onlyTable : styles.tableList}>
            <Table
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              scroll={{ y: 264 }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default stepTable;
