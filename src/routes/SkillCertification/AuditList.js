/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form } from 'antd';
import { routerRedux } from 'dva/router';
import { assignUrlParams } from 'utils/utils';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import AuditListForm from './component/AuditList_Form';
import AuditListModel from './component/AuditList_Model';
import common from '../Common/common.css';
//
const SearchForm = Form.create()(AuditListForm);

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/getAuditList'],
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
    this.state = {
      visible: false,
      modelType: '',
      title: '',
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
  // 审核记录
  onRecord = () => {
    this.props.dispatch(routerRedux.push('/skillCertification/auditRecord'));
  };

  // 报名审核
  onSign = () => {
    this.props.dispatch(routerRedux.push('/skillCertification/auditApply'));
  };

  // 导入认证
  importExcel = () => {
    this.props.dispatch(routerRedux.push('/skillCertification/auditImport'));
  };

  showModal = (t, record) => {
    this.setState({
      visible: true,
      modelType: t,
      title: t === 1 ? '发布认证' : t === 2 ? '导出底表' : '认证审核',
    });
    this.record = record;
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
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
              {record.signStatus === 1 && (
                <AuthorizedButton authority="/skillCertification/auditApply">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.onSign(record)}
                  >
                    报名审核
                  </span>
                </AuthorizedButton>
              )}
              {record.signResult === 1 && (
                <AuthorizedButton authority="/skillCertification/auditCertify">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.showModal(3, record)}
                  >
                    认证审核
                  </span>
                </AuthorizedButton>
              )}
              <AuthorizedButton authority="/skillCertification/auditRecord">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onRecord(record)}
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

  render() {
    const { loading } = this.props;
    const { pageNum } = this.state.params;
    const totalElements = 4;

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
          <div style={{ marginTop: 15 }}>
            <AuthorizedButton authority="/skillCertification/exportTable">
              <Button
                onClick={() => this.showModal(2)}
                type="primary"
                className={common.deleteQualityButton}
              >
                导出底表
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/skillCertification/auditImport">
              <Button
                onClick={this.importExcel}
                type="primary"
                className={common.addQualityButton}
                style={{ marginLeft: 10 }}
              >
                导入认证
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/skillCertification/certificationPublish">
              <Button
                onClick={() => this.showModal(1)}
                type="primary"
                className={common.createButton}
              >
                发布认证
              </Button>
            </AuthorizedButton>
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
            showPageSize={3}
            defaultPageSize={3}
          />
        }
      >
        <AuditListModel
          title={this.state.title}
          visible={this.state.visible}
          modelType={this.state.modelType}
          record={this.record}
          onOk={params => this.handleOk(params)}
          onCancel={this.handleCancel}
        />
      </ContentLayout>
    );
  }
}

export default AuditList;
