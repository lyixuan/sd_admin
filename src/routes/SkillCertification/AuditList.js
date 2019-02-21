/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Popconfirm } from 'antd';
import { routerRedux } from 'dva/router';
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
    this.pageNum = 0;
    this.pageSize = 30;
    const storageData = JSON.parse(sessionStorage.getItem('tempFrom'));
    if (storageData) {
      this.pageNum = storageData.pageNum;
      this.pageSize = storageData.pageSize;
    }
    this.params = {};
    this.oriSearchParams = {};
    this.state = {
      modelType: '',
      title: '',
    };
  }

  UNSAFE_componentWillMount() {
    const params = {};
    this.props.dispatch({
      type: 'audit/listOrg',
      payload: { params },
    });
    this.props.dispatch({
      type: 'audit/findCertificationList',
      payload: { params },
    });
  }
  // 审核记录
  onRecord = val => {
    this.props.setRouteUrlParams('/skillCertification/auditRecord', {
      userId: val.userId,
    });
    sessionStorage.setItem('tempFrom', JSON.stringify(this.oriSearchParams));
  };

  // 报名审核
  onSign = val => {
    this.props.setRouteUrlParams('/skillCertification/auditApply', {
      certificationInfoId: val.certificationInfoId,
    });
    sessionStorage.setItem('tempFrom', JSON.stringify(this.oriSearchParams));
  };

  // 查看
  onShowDetail = val => {
    this.props.setRouteUrlParams('/excellent/checkCertifiedDetail', {
      id: val.id,
    });
    sessionStorage.setItem('tempFrom', JSON.stringify(this.oriSearchParams));
  };

  // 发布一个项目
  onPublish = record => {
    this.props.dispatch({
      type: 'audit/auditSinglePublish',
      payload: {
        params: { certificationDetailId: record.id },
        callbackParams: this.params,
      },
    });
  };

  // 导入认证
  importExcel = () => {
    this.props.dispatch(routerRedux.push('/skillCertification/auditImport'));
    sessionStorage.setItem('tempFrom', JSON.stringify(this.oriSearchParams));
  };

  showModal = (t, record) => {
    this.setState({
      modelType: t,
      title: t === 1 ? '发布认证' : t === 2 ? '导出底表' : '认证审核',
    });
    this.props.dispatch({
      type: 'audit/showModel',
      payload: { visible: true },
    });
    this.record = record;
  };

  handleOk = params => {
    if (this.state.modelType === 2) {
      this.props.dispatch({
        type: 'audit/exportBottomTable',
        payload: { params },
      });
    }
    if (this.state.modelType === 1) {
      this.props.dispatch({
        type: 'audit/auditPublish',
        payload: { params, callbackParams: this.params },
      });
    }
    if (this.state.modelType === 3) {
      this.props.dispatch({
        type: 'audit/submitExamineResult',
        payload: { params, callbackParams: this.params },
      });
    }
  };

  handleCancel = () => {
    this.props.dispatch({
      type: 'audit/showModel',
      payload: { visible: false },
    });
  };

  // 表单搜索函数
  search = (params, values, pg) => {
    const obj = params ? { ...params } : this.params;
    this.pageNum = pg === 1 ? 0 : this.pageNum;
    obj.number = this.pageNum;
    obj.size = this.pageSize;
    this.params = { ...obj };
    this.props.dispatch({
      type: 'audit/getAuditList',
      payload: { obj },
    });
    if (values) {
      this.oriSearchParams = values;
    }
    this.oriSearchParams.pageSize = this.pageSize;
    this.oriSearchParams.pageNum = this.pageNum;
  };

  // 点击某一页函数
  changePage = current => {
    this.pageNum = current - 1;
    this.search();
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '编号',
        width: 60,
        dataIndex: 'certificationInfoId',
      },
      {
        title: '姓名',
        dataIndex: 'userName',
      },
      {
        title: '组织',
        width: 150,
        dataIndex: 'orgName',
      },
      {
        title: '认证项目',
        width: 150,
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
        width: 150,
        render: (text, record) => {
          return (
            <div>
              {record.applyTypeName === '电脑端' && (
                <AuthorizedButton authority="/excellent/checkCertifiedDetail">
                  <span
                    style={{
                      color: '#52C9C2',
                      marginRight: 10,
                      cursor: 'pointer',
                      display: 'inline-block',
                    }}
                    onClick={() => this.onShowDetail(record)}
                  >
                    查看
                  </span>
                </AuthorizedButton>
              )}
              {record.signStatus === 1 && (
                <AuthorizedButton authority="/skillCertification/auditApply">
                  <span
                    style={{
                      color: '#52C9C2',
                      marginRight: 10,
                      cursor: 'pointer',
                      display: 'inline-block',
                    }}
                    onClick={() => this.onSign(record)}
                  >
                    报名审核
                  </span>
                </AuthorizedButton>
              )}
              {record.signResult === 1 && (
                <AuthorizedButton authority="/skillCertification/auditCertify">
                  <span
                    style={{
                      color: '#52C9C2',
                      marginRight: 10,
                      cursor: 'pointer',
                      display: 'inline-block',
                    }}
                    onClick={() => this.showModal(3, record)}
                  >
                    认证审核
                  </span>
                </AuthorizedButton>
              )}
              {record.examineStatus === 2 &&
                !record.published && (
                  <AuthorizedButton authority="/skillCertification/certificationPublishOne">
                    <Popconfirm
                      placement="topRight"
                      title="是否确定发布该条认证审核结果？"
                      onConfirm={() => this.onPublish(record)}
                    >
                      <span
                        style={{
                          color: '#52C9C2',
                          marginRight: 10,
                          cursor: 'pointer',
                          display: 'inline-block',
                        }}
                      >
                        发布
                      </span>
                    </Popconfirm>
                  </AuthorizedButton>
                )}
              <AuthorizedButton authority="/skillCertification/auditRecord">
                <span
                  style={{ color: '#52C9C2', cursor: 'pointer', display: 'inline-block' }}
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
    const { content, totalElements } = this.props.audit.auditList;
    const { publicSubmitting } = this.props.audit;

    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <SearchForm
            auditData={this.props.audit}
            handleSearch={(params, values, rs) => {
              this.search(params, values, rs);
            }}
          />
        }
        contentButton={
          <div>
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
              dataSource={content}
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
            defaultCurrent={this.pageNum + 1}
            total={totalElements}
          />
        }
      >
        <AuditListModel
          title={this.state.title}
          visible={this.props.audit.visible}
          modelType={this.state.modelType}
          record={this.record}
          publicSubmitting={publicSubmitting}
          onOk={params => this.handleOk(params)}
          onCancel={this.handleCancel}
        />
      </ContentLayout>
    );
  }
}

export default AuditList;
