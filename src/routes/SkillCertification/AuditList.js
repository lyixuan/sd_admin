/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { assignUrlParams } from 'utils/utils';
import { Table, Button, Form, Popconfirm } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import AuditListForm from './AuditList_Form';
import common from '../Common/common.css';
//
const SearchForm = Form.create()(AuditListForm);

@connect(({ audit, user, loading }) => ({
  audit,
  user,
  listOrg: loading.effects['user/listOrg'],
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

  componentDidMount() {
    const params = {};
    this.props.dispatch({
      type: 'user/listOrg',
      payload: { params },
    });
  }
  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '组织',
        dataIndex: 'mail',
      },
      {
        title: '认证项目',
        dataIndex: 'userType',
      },
      {
        title: '考核周期',
        dataIndex: 'showName',
      },
      {
        title: '报名月份',
        dataIndex: 'changeShowName',
      },
      {
        title: '报名状态',
        dataIndex: 'roleName',
      },
      {
        title: '报名结果',
        dataIndex: 'privilege',
      },
      {
        title: '认证状态',
        dataIndex: 'privilege1',
      },
      {
        title: '认证结果',
        dataIndex: 'privilege2',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              {record.changeShowName &&
              record.changeShowName !== '' &&
              (record.userType !== 'admin' || record.userType !== 'boss') &&
              record.changeShowName !== record.showName ? (
                record.privilege === '有' ? null : (
                  <AuthorizedButton authority="/user/updateUser">
                    <span
                      style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                      onClick={() => this.onUpdate(record)}
                    >
                      报名审核
                    </span>
                  </AuthorizedButton>
                )
              ) : null}
              <AuthorizedButton authority="/user/editUser">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  认证审核
                </span>
              </AuthorizedButton>
              {record.privilege === '有' ? null : (
                <AuthorizedButton authority="/user/deleteUser">
                  <Popconfirm title="是否确认删除该用户?" onConfirm={() => this.onDelete(record)}>
                    <span style={{ color: '#52C9C2', cursor: 'pointer' }}>审核记录</span>
                  </Popconfirm>
                </AuthorizedButton>
              )}
            </div>
          );
        },
      },
    ];
    return columns || [];
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        name: item.name,
        privilege: item.privilege ? '有' : '无',
        mail: item.entUserId,
        userType: window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${item.userType}`).name,
        showName: !item.showName
          ? item.userType === 'others' ? '无绩效岗位' : null
          : item.showName.replace(/,/g, ' | '), // showName.replace(/\,/g,"|")
        changeShowName: !item.changeShowName ? null : item.changeShowName.replace(/,/g, ' | '),
        id: item.id,
        wechatDepartmentId: item.wechatDepartmentId,
        wechatDepartmentName: item.wechatDepartmentName,
        roleName: item.roleName,
      })
    );

    return data;
  };

  // 表单搜索函数
  search = () => {};
  render() {
    const { loading } = this.props;
    const { pageNum } = this.state.params;
    const { userListData = {} } = this.props.audit.userList;
    const { totalElements = 0, content = [] } = userListData;
    const dataSource = this.fillDataSource(content);

    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <SearchForm
            propsData={this.props}
            resetContent={() => {
              this.resetContent();
            }}
            handleSearch={(values, dataString) => {
              this.search(values, dataString);
            }}
          />
        }
        contentButton={
          <div style={{ marginTop: 10 }}>
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
              dataSource={dataSource}
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
