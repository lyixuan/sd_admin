/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Popconfirm, Popover, message } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import AuditListForm from './component/ScoreAdjustList_Form';
import common from '../Common/common.css';
import style from './score.css';

const SearchForm = Form.create()(AuditListForm);
const contentDel = (
  <div style={{ marginBottom: '-15px' }}>
    <p>是否确认删除该条数据？</p>
    <p>记得联系产研一组产品经理刷新缓存后生效哦</p>
  </div>
);

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/getAuditList'],
}))
class ScoreAdjustList extends Component {
  constructor(props) {
    super(props);
    this.pageNum = 0;
    this.pageSize = 30;
    this.params = {};
    this.oriSearchParams = {};
    this.state = {};
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
  // 添加调整
  onCreate = () => {
    this.props.setRouteUrlParams('/appeal/scoreAdjustCreate', {});
    sessionStorage.setItem('tempFrom', JSON.stringify(this.oriSearchParams));
  };

  // 编辑调整
  onEdit = val => {
    this.props.setRouteUrlParams('/appeal/scoreAdjustEdit', {
      certificationInfoId: val.certificationInfoId,
    });
    sessionStorage.setItem('tempFrom', JSON.stringify(this.oriSearchParams));
  };

  // 删除
  onDel = val => {
    console.log(val);
    message.success('Click on Yes');
  };

  // 表单搜索函数
  search = (params, values) => {
    const obj = params ? { ...params } : this.params;
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
    this.oriSearchParams.size = this.size;
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
        title: '序号',
        dataIndex: 'certificationInfoId',
      },
      {
        title: '学分日期',
        dataIndex: 'userName',
      },
      {
        title: '调整类型',
        dataIndex: 'orgName',
      },
      {
        title: '均分',
        dataIndex: 'certificationItemName',
      },
      {
        title: '调整级别',
        dataIndex: 'assessCycStr',
      },
      {
        title: '调整组织',
        dataIndex: 'applyTimeMonth',
      },
      {
        title: '操作人',
        dataIndex: 'signStatusStr',
      },
      {
        title: '更新时间',
        dataIndex: 'signResultStr',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div className="scoreAdjust">
              <Popover
                content={
                  <div className={style.bline}>
                    尚德经历尚德经历尚德经历 \n 数据代理洒djd到家了时间的家连锁店
                  </div>
                }
                trigger="click"
              >
                <span style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}>
                  查看备注
                </span>
              </Popover>
              {record.signResult === 1 && (
                <AuthorizedButton authority="/appeal/scoreAdjustEdit">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.onEdit(record)}
                  >
                    编辑
                  </span>
                </AuthorizedButton>
              )}
              <AuthorizedButton authority="/appeal/scoreAdjustDel">
                <Popconfirm
                  placement="topRight"
                  title={contentDel}
                  onConfirm={() => this.onDel(record)}
                >
                  <span style={{ color: '#52C9C2', cursor: 'pointer' }}>删除</span>
                </Popconfirm>
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

    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <SearchForm
            auditData={this.props.audit}
            handleSearch={(params, values) => {
              this.search(params, values);
            }}
          />
        }
        contentButton={
          <div style={{ marginTop: 15 }}>
            <AuthorizedButton authority="/appeal/scoreAdjustCreate">
              <Button
                onClick={() => this.onCreate()}
                type="primary"
                className={common.createButton}
              >
                添加调整
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
      />
    );
  }
}

export default ScoreAdjustList;
