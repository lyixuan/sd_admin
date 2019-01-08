/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { routerRedux } from 'dva/router';
import { assignUrlParams } from 'utils/utils';
import ContentLayout from '../../layouts/ContentLayout';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
//

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/getAuditList'],
}))
class AuditRecord extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    const initParams = {
      params: {
        pageNum: 0, // 翻页---当前页码
        pageSize: 30, // 每页显示数据
      },
    };
    this.state = assignUrlParams(initParams, params);
  }

  // 返回
  handleBack = () => {
    this.props.dispatch(routerRedux.push('/skillCertification/auditList'));
  };

  // 表单搜索函数
  search = params => {
    this.props.dispatch({
      type: 'audit/getAuditList',
      payload: { params },
    });
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '认证项目',
        dataIndex: 'code',
      },
      {
        title: '报名月份',
        dataIndex: 'name',
      },
      {
        title: '报名结果',
        dataIndex: 'orgName',
      },
      {
        title: '驳回原因',
        dataIndex: 'certificationItemName',
      },
      {
        title: '报名审核人',
        dataIndex: 'assessCycStr',
      },
      {
        title: '报名审核时间',
        dataIndex: 'applyTimeMonth',
      },
      {
        title: '认证结果',
        dataIndex: 'signStatusStr',
      },
      {
        title: '认证审核人',
        dataIndex: 'signResultStr',
      },
      {
        title: '认证审核时间',
        dataIndex: 'examineStatusStr',
      },
      {
        title: '认证发布时间',
        dataIndex: 'examineResultStr',
      },
    ];
    return columns || [];
  };

  render() {
    const { loading } = this.props;
    const { pageNum } = this.state.params;
    const totalElements = 4;
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <div style={{ marginTop: 15, color: '#000', marginBottom: 30 }}>
            <span>姓名：刘样</span>
            <span style={{ marginLeft: 400 }}>组织：自变量学院|汉语言文学本科2|汉语言文学</span>
          </div>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalElements}条</p>
            <Table
              rowKey={record => record.id}
              bordered
              loading={loading}
              dataSource={this.props.audit.auditList}
              columns={this.columnsData()}
              pagination={false}
              className={common.tableContentStyle}
            />
          </div>
        }
        contentPagination={
          <SelfPagination
            onChange={(current, pageSize) => {
              this.changePage(current, pageSize);
            }}
            onShowSizeChange={(current, pageSize) => {
              this.onShowSizeChange(current, pageSize);
            }}
            defaultCurrent={pageNum + 1}
            total={totalElements}
            defaultPageSize={3}
            showPageSize={3}
          />
        }
      >
        <Button
          onClick={this.handleBack}
          type="primary"
          style={{ float: 'right', marginBottom: 15 }}
          className={common.createButton}
        >
          返回
        </Button>
      </ContentLayout>
    );
  }
}

export default AuditRecord;
