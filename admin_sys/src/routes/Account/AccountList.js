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
    const params = {};
    const params2 = { id: 1 };
    this.props.dispatch({
      type: 'account/accountList',
      payload: { params, params2 },
    });
  }

  // 删除账号函数
  onDelete = key => {
    // const dataSource = [...this.state.dataSource];
    // this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    console.log(key);
    const params = { name: 'test', mail: 'test@qq.com', roleId: 1, status: 1 };
    this.props.dispatch({
      type: 'account/deleteAccount',
      payload: { params },
    });
  };

  // 编辑账号函数
  onEdit = key => {
    console.log(key);
    this.props.setRouteUrlParams('/account/editAccount', {
      name: key.name,
      email: key.email,
      role: key.role,
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
  fillDataSource = () => {
    const data = [];
    for (let i = 0; i < 50; i += 1) {
      data.push({
        key: i,
        name: `张三`,
        role: `院长`,
        email: `hello${i}@sunlands.com`,
      });
    }
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
    this.props.setRouteUrlParams('/account/createAccount', { a: 2, b: 3 });
  };

  render() {
    const dataSource = !this.fillDataSource() ? [] : this.fillDataSource();
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
            <p className={common.totalNum}>总数：500条</p>
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
            total={1000}
            className={common.paginationStyle}
          />
        }
      />
    );
  }
}
export default AccountList;
