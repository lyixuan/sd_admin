/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form } from 'antd';
import { assignUrlParams } from 'utils/utils';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import AuditListForm from './component/AuditList_Form';
import common from '../Common/common.css';
//
const SearchForm = Form.create()(AuditListForm);

@connect(({ audit }) => ({
  audit,
}))
class AuditList extends Component {
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

  UNSAFE_componentWillMount() {
    const params = {};
    this.props.dispatch({
      type: 'audit/listOrg',
      payload: { params },
    });
  }
  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '组织',
        dataIndex: 'orgName',
      },
      {
        title: '认证项目',
        dataIndex: 'certificationItemName',
      },
      {
        title: '考核周期',
        dataIndex: 'assessCycStr',
      },
      {
        title: '报名月份',
        dataIndex: 'applyTimeMonth',
      },
      {
        title: '报名状态',
        dataIndex: 'signStatusStr',
      },
      {
        title: '报名结果',
        dataIndex: 'signResultStr',
      },
      {
        title: '认证状态',
        dataIndex: 'examineStatusStr',
      },
      {
        title: '认证结果',
        dataIndex: 'examineResultStr',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/skillCertification/auditList">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onUpdate(record)}
                >
                  报名审核
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/skillCertification/auditList">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  认证审核
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/skillCertification/auditList">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  审核记录
                </span>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns || [];
  };

  // 表单搜索函数
  search = params => {
    this.props.dispatch({
      type: 'audit/getAuditList',
      payload: { params },
    });
  };
  render() {
    const { loading } = this.props;
    const { pageNum } = this.state.params;
    const totalElements = 0;
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <SearchForm
            auditData={this.props.audit}
            handleSearch={params => {
              this.search(params);
            }}
          />
        }
        contentButton={
          <div style={{ marginTop: 20 }}>
            <AuthorizedButton authority="">
              <Button
                onClick={this.handleAdd}
                type="primary"
                className={common.deleteQualityButton}
              >
                导出底表
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="">
              <Button
                onClick={this.handleAdd}
                type="primary"
                className={common.addQualityButton}
                style={{ marginLeft: 10 }}
              >
                导入认证
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="">
              <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
                发布认证
              </Button>
            </AuthorizedButton>
          </div>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalElements}条</p>
            <Table
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
            defaultPageSize={30}
          />
        }
      />
    );
  }
}

export default AuditList;
