import React from 'react';
import { connect } from 'dva';
import { Table, Popconfirm } from 'antd';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import Time from './TimeList';
import styles from './TimeList.css';

@connect(({ time, loading }) => ({
  time,
  listLoading: loading.effects['time/getKpiEffectMonth'],
}))
export default class Performance extends Time {
  componentDidMount() {
    this.getKpiEffectMonth();
  }

  getKpiEffectMonth = () => {
    this.props.dispatch({
      type: 'time/getKpiEffectMonth',
    });
  };
  onEdit = record => {
    const { isShowState, key } = record;
    const params = {
      id: key,
      isShow: (Number(isShowState) + 1) % 2,
    };
    this.props.dispatch({
      type: 'time/updateKpiEffectMonth',
      payload: params,
    });
  };

  columnsData = () => {
    const columns = [
      {
        title: '时间',
        dataIndex: 'effectMonth',
        width: 200,
        key: 'effectMonth',
      },
      {
        title: '前端可查看',
        dataIndex: 'isShow',
        width: 200,
        key: 'isShow',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const { isShowState } = record;
          const titleObj = { 0: '是否设置为前端不可查看?', 1: '是否设置为前端可查看?' };
          return (
            <div className={styles.PopconfirmContainer}>
              <AuthorizedButton authority="/timeManage/deleteDate">
                <Popconfirm title={titleObj[isShowState]} onConfirm={() => this.onEdit(record)}>
                  <span style={{ color: '#52C9C2', cursor: 'pointer' }}>编辑</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns;
  };
  render() {
    const { listLoading } = this.props;
    const { kpiEffectMonthList = [] } = this.props.time;
    const dataSorce = kpiEffectMonthList.map(item => ({
      key: item.id,
      effectMonth: item.effectMonth,
      isShowState: item.isShow,
      isShow: { 0: '是', 1: '否' }[item.isShow],
    }));
    return (
      <div className={styles.performanceContainer}>
        <hr className={styles.splitLine} />
        <h2 className={styles.performanceTitle}>绩效模块</h2>
        <p className={styles.tableTitle}>“实发绩效”发布月份设置</p>
        <div className={styles.performanceTable}>
          <Table
            bordered
            loading={listLoading}
            dataSource={dataSorce}
            columns={this.columnsData()}
            useFixedHeader
            scroll={{ y: 600 }}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}
