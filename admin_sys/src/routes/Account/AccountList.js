import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/accountList'],
}))
class AccountList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const accountListParams = { size: 30, number: 0, orderType: 'name' };
    this.props.dispatch({
      type: 'account/accountList',
      payload: { accountListParams },
    });
  }

  // 删除账号函数  删除后数据更新？
  onDelete = key => {
    const deleteAccountParams = { accountId: key.id };
    const accountListParams = {};
    this.props.dispatch({
      type: 'account/deleteAccount',
      payload: { deleteAccountParams, accountListParams },
    });
  };

  // 编辑账号函数
  onEdit = key => {
    this.props.setRouteUrlParams('/account/editAccount', {
      id: key.id,
    });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    const accountListParams = { size: pageSize, number: current - 1, orderType: 'name' };
    this.props.dispatch({
      type: 'account/accountList',
      payload: { accountListParams },
    });
  };

  // 点击某一页函数
  changePage = (current, pageSize) => {
    const accountListParams = { size: pageSize, number: current - 1, orderType: 'name' };
    this.props.dispatch({
      type: 'account/accountList',
      payload: { accountListParams },
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
                <span
                  style={{ color: '#52C9C2', marginRight: 16,cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/account/deleteAccout">
                <Popconfirm title="是否确认删除该账号?" onConfirm={() => this.onDelete(record)}>
                  <span style={{ color: '#52C9C2', cursor: 'pointer' }}> 删除</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns || [];
  };

  // 创建账号函数
  handleAdd = () => {
    this.props.setRouteUrlParams('/account/createAccount', {});
  };

  render() {
    const { loading } = this.props;
    const data = !this.props.account.accountList.response
      ? []
      : !this.props.account.accountList.response.data
        ? []
        : this.props.account.accountList.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = this.columnsData();
    return (
      <ContentLayout
        routerData={this.props.routerData}
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
              loading={loading}
              dataSource={dataSource}
              columns={columns}
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
            defaultCurrent={1}
            total={totalNum}
            defaultPageSize={30}
            pageSizeOptions={['30']}
          />
        }
      />
    );
  }
}
export default AccountList;
