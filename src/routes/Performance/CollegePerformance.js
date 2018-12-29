import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { assignUrlParams } from 'utils/utils';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from './_dialog';
import common from '../Common/common.css';

@connect(({ performance, loading }) => ({
  performance,
  loading: loading.models.performance,
}))
class CollegePerformance extends Component {
  constructor(props) {
    super(props);
    const { urlParams = {} } = props;
    const initState = {
      isShowModal: false,
      collegeGroup: {},
      title: '导出绩效金额',
      fetchUrl: '',
    };
    this.state = assignUrlParams(initState, urlParams);
  }
  componentDidMount() {
    this.getData();
    this.props.dispatch({
      type: 'performance/getExportCollegeList',
      payload: {},
    });
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
      collegeId: key.collegeId,
    });
  };

  showModal = bol => {
    this.setState({ isShowModal: bol });
  };
  fetchData = param => {
    this.props.dispatch({
      type: this.state.fetchUrl,
      payload: param,
    });

    this.showModal(false);
  };
  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    if (val) {
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
    }
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
        align: 'center',
      },
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            家族绩效<br />(总包绩效 | 实发绩效）
          </div>
        ),
        dataIndex: 'familyTotalKpi',
        align: 'center',
      },
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            小组绩效<br />(总包绩效 | 实发绩效）
          </div>
        ),
        dataIndex: 'groupTotalKpi',
        align: 'center',
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
    const collegeGroup = { ...this.props.performance.listCollege, 0: '全部学院' };
    this.setState({
      isShowModal: true,
      fetchUrl: 'performance/exportCollegeAchievement',
      collegeGroup,
      title: '导出绩效金额',
    });
  };

  // 导出绩效详情
  exportDetail = () => {
    this.setState({
      isShowModal: true,
      fetchUrl: 'performance/exportCollegeDetailKpi',
      collegeGroup: {
        0: '家族',
        1: '小组',
      },
      title: '导出绩效详情',
    });
  };
  // 导入实发绩效
  importPerformance = () => {
    this.props.setRouteUrlParams('/performance/importPerformance');
  };
  render() {
    const { isShowModal, title, collegeGroup } = this.state;
    const val = this.props.performance.dataCollege ? this.props.performance.dataCollege : {};
    const dataSource = !val.response ? [] : this.fillDataSource(val.response.data);
    const columns = !this.columnsData() ? [] : this.columnsData();
    return (
      <div>
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
                <Button
                  onClick={this.importPerformance}
                  type="primary"
                  className={common.exportBlue}
                >
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
        <ModalDialog
          showModal={bol => this.showModal(bol)}
          title={title}
          collegeGroup={collegeGroup}
          visible={isShowModal}
          fetchData={param => this.fetchData(param)}
        />
      </div>
    );
  }
}
export default CollegePerformance;
