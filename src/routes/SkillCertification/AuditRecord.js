/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { routerRedux } from 'dva/router';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';
//

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/auditLogList'],
}))
class AuditRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    const params = this.props.getUrlParams();
    this.props.dispatch({
      type: 'audit/auditLogList',
      payload: { params },
    });
  }
  // 返回
  handleBack = () => {
    this.props.dispatch(routerRedux.push('/skillCertification/auditList'));
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '认证项目',
        dataIndex: 'certificationItemName',
      },
      {
        title: '报名月份',
        dataIndex: 'signMonth',
      },
      {
        title: '报名结果',
        dataIndex: 'signResult',
      },
      {
        title: '驳回原因',
        dataIndex: 'remarks',
      },
      {
        title: '报名审核人',
        dataIndex: 'signExaminer',
      },
      {
        title: '报名审核时间',
        dataIndex: 'signExamineTime',
      },
      {
        title: '认证结果',
        dataIndex: 'examineResult',
      },
      {
        title: '认证审核人',
        dataIndex: 'certificationExaminer',
      },
      {
        title: '认证审核时间',
        dataIndex: 'certificationExamineTime',
      },
      {
        title: '认证发布时间',
        dataIndex: 'certificationPublishTime',
      },
    ];
    return columns || [];
  };

  render() {
    const { loading } = this.props;
    const logList = this.props.audit.logData ? this.props.audit.logData.examineLogList : [];
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <div style={{ marginTop: 15, color: '#000', marginBottom: 30 }}>
            <span>姓名：{this.props.audit.logData.userName}</span>
            <span style={{ marginLeft: 400 }}>组织：{this.props.audit.logData.organization}</span>
          </div>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{logList ? logList.length : 0}条</p>
            <Table
              rowKey={record => record.signExamineTime}
              bordered
              loading={loading}
              dataSource={logList}
              columns={this.columnsData()}
              pagination={false}
              className={common.tableContentStyle}
            />
          </div>
        }
      >
        <Button
          onClick={this.handleBack}
          type="primary"
          style={{ float: 'right', marginBottom: 15, marginTop: 15 }}
          className={common.createButton}
        >
          返回
        </Button>
      </ContentLayout>
    );
  }
}

export default AuditRecord;
