import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

@connect(({ performance, loading }) => ({
  performance,
  loading: loading.models.performance,
}))
class CollegePerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.getData();
  }

  getData = params => {
    const getListParams = { ...this.props.performance.getListParams, ...params };
    this.props.dispatch({
      type: 'performance/getCollegeList',
      payload: { getListParams },
    });
  };

  // 查看详情
  checkDetail = key => {
    this.props.setRouteUrlParams('/performance/personalPerformance', {
      id: key.id,
    });
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        collegeName: item.collegeName,
        effectMonth: item.effectMonth,
        collegeTotalKpi: `${+item.collegeTotalKpi} | ${+item.collegeActualKpi}`,
        familyTotalKpi: `${+item.familyTotalKpi} | ${+item.familyActualKpi}`,
        groupTotalKpi: `${+item.groupTotalKpi} | ${+item.groupActualKpi}`,
        collegeId: item.collegeId,
      })
    );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'collegeId',
      },
      {
        title: '学院',
        dataIndex: 'collegeName',
      },
      {
        title: '月份',
        dataIndex: 'effectMonth',
      },
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            学院绩效<br />(总包绩效 | 实发绩效）
          </div>
        ),
        dataIndex: 'collegeTotalKpi',
      },
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            家族绩效<br />(总包绩效 | 实发绩效）
          </div>
        ),
        dataIndex: 'familyTotalKpi',
      },
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            小组绩效<br />(总包绩效 | 实发绩效）
          </div>
        ),
        dataIndex: 'groupTotalKpi',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/performance/personalPerformance">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.checkDetail(record)}
                >
                  查看详情
                </span>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns || [];
  };

  // 导出绩效金额
  exportAmount = () => {
    console.log('导出绩效金额');
  };
  // 导出绩效详情
  exportDetail = () => {
    console.log('导出绩效详情');
  };
  // 导入实发绩效
  importAmount = () => {
    this.props.setRouteUrlParams('/performance/importPerformance');
  };
  render() {
    const val = this.props.performance.dataList ? this.props.performance.dataList : {};
    const dataSource = !val.response ? [] : this.fillDataSource(val.response.data);
    const columns = !this.columnsData() ? [] : this.columnsData();
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <div>
            <AuthorizedButton authority="/performance/exportAmount">
              <Button onClick={this.exportAmount} type="primary" className={common.exportYellow}>
                导出绩效金额
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/performance/exportDetail">
              <Button onClick={this.exportDetail} type="primary" className={common.exportYellow}>
                导出绩效详情
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/performance/importPerformance">
              <Button onClick={this.importAmount} type="primary" className={common.exportBlue}>
                导入实发绩效
              </Button>
            </AuthorizedButton>
          </div>
        }
        contentTable={
          <div>
            <p className={common.totalNum} />
            <Table
              loading={this.props.loading}
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              className={common.tableContentStyle}
            />
          </div>
        }
      />
    );
  }
}
export default CollegePerformance;
