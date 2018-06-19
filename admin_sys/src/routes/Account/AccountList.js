import React, { Component } from 'react';
import { Table, Button, Pagination } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';

class AccountList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: '100px',
      },
      {
        title: '角色',
        dataIndex: 'role',
        width: '200px',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: '300px',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '100px',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '100px',
        render: (text, record) => {
          return (
            <span style={{ color: '#46A3EF' }} onClick={() => this.onEdit(record.key)}>
              编辑
            </span>
          );
        },
      },
    ];

    const dataSource = [
      {
        key: 1,
        name: `张三`,
        role: `院长`,
        status: `启用`,
        email: `hello@sunlands.com`,
      },
      {
        key: 2,
        name: `王五`,
        role: `学员`,
        status: `启用`,
        email: `hello@sunlands.com`,
      },
      {
        key: 3,
        name: `赵六`,
        role: `院长`,
        status: `禁止`,
        email: `hello@sunlands.com`,
      },
    ];

    this.state = {
      dataSource: !dataSource ? [] : dataSource,
      count: 3,
    };
  }
  onEdit = () => {
    this.props.history.push({
      pathname: '/account/editAccount',
      search: null,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    this.props.history.push({
      pathname: '/account/createAccount',
      search: null,
    });
    const newData = {
      key: count + 1,
      name: `李四 ${count + 1}`,
      role: `质检员${count + 1}`,
      status: `禁止${count + 1}`,
      email: `world${count + 1}@sunlands.com`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  render() {
    const { dataSource } = this.state;
    const columns = !this.columns ? [] : this.columns;
    return (
      <ContentLayout
        contentButton={
          <Button
            onClick={this.handleAdd}
            type="primary"
            style={{ marginBottom: 16, marginTop: 0 }}
          >
            + 创建
          </Button>
        }
        contentTable={
          <Table bordered dataSource={dataSource} columns={columns} pagination={false} />
        }
        contentPagination={
          <Pagination
            showQuickJumper
            pageSizeOptions={20}
            onChange={this.onShowSizeChange}
            defaultCurrent={3}
            total={100}
            style={{ marginTop: 24 }}
          />
        }
      />
    );
  }
}
export default AccountList;
