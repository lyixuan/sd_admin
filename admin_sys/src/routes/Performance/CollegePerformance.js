import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

@connect(({ quality, loading }) => ({
  quality,
  loading: loading.models.quality,
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
    const getListParams = { ...this.props.quality.getListParams, ...params };
    this.props.dispatch({
      type: 'quality/getQualityList',
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
        name: item.name,
        role: item.rname,
        email: item.mail, //   const newmail = `${values.mail}@sunlans.com`;
        id: item.id,
        roleId: item.roleId,
      })
    );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '学院',
        dataIndex: 'name',
      },
      {
        title: '月份',
        dataIndex: 'role',
      },
      {
        title: '学院绩效(总包绩效 | 实发绩效）',
        dataIndex: 'email',
      },
      {
        title: '家族绩效(总包绩效 | 实发绩效）',
        dataIndex: 'email1',
      },
      {
        title: '小组绩效(总包绩效 | 实发绩效）',
        dataIndex: 'email2',
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
    this.props.setRouteUrlParams('/performance/exportPerformance');
  };
  render() {
    const val = this.props.quality.qualityList;
    const data = !val.response ? [] : !val.response.data ? [] : val.response.data;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
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
            <AuthorizedButton authority="/performance/exportPerformance">
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
