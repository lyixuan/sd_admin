import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Pagination, Popconfirm } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

@connect(({ account, loading }) => ({
  account,
  loading,
}))
class AccountList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const accountListParams = {};
    this.props.dispatch({
      type: 'account/accountList',
      payload: { accountListParams },
    });
    // 为了提前获取角色列表数据。
    const getRoleListParams = {};
    this.props.dispatch({
      type: 'account/getRoleList',
      payload: { getRoleListParams },
    });
  }

  // 删除账号函数  删除后数据更新？
  onDelete = key => {
    console.log(key.id);
    const deleteAccountParams = { accountId: key.id };
    const accountListParams = {};
    this.props.dispatch({
      type: 'account/deleteAccount',
      payload: { deleteAccountParams, accountListParams },
    });
  };

  // 编辑账号函数
  onEdit = key => {
    console.log(key);
    this.props.setRouteUrlParams('/account/editAccount', {
      name: key.name,
      email: key.email,
      role: key.role,
      id: key.id,
      roleId: key.roleId,
      from: 'edit',
    });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  // 点击某一页函数
  changePage = (current, pageSize) => {
    console.log(current, pageSize);
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        name: item.name,
        role: item.rname,
        email: item.mail,
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
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '角色',
        dataIndex: 'role',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/account/editAccount">
                <span style={{ color: '#52C9C2' }} onClick={() => this.onEdit(record)}>
                  编辑
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/account/editAccount">
                <Popconfirm title="是否确认删除该账号?" onConfirm={() => this.onDelete(record)}>
                  <span style={{ color: '#52C9C2', marginLeft: 12 }}>删除</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  // 创建账号函数
  handleAdd = () => {
    this.props.setRouteUrlParams('/account/createAccount', {});
  };

  render() {
    const data = !this.props.account.accountList.response
      ? []
      : !this.props.account.accountList.response.data?[]:this.props.account.accountList.response.data;
    const totalNum = !data.size ? 0 : data.size;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = !this.columnsData() ? [] : this.columnsData();
    return (
      <ContentLayout
        pageHeraderUnvisible="unvisible"
        title="账号列表"
        contentButton={
          <AuthorizedButton authority="/account/createAccount">
            <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
              + 创建
            </Button>
          </AuthorizedButton>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalNum}条</p>
            <Table
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              className={common.tableContentStyle}
            />
          </div>
        }
        contentPagination={
          <Pagination
            showSizeChanger
            onChange={this.changePage}
            onShowSizeChange={this.onShowSizeChange}
            defaultCurrent={1}
            total={totalNum}
            className={common.paginationStyle}
          />
        }
      />
    );
  }
}
export default AccountList;
