import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

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
          return this.state.dataSource.length > 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              编辑
            </Popconfirm>
          ) : null;
        },
      },
    ];

    const dataSource = [];
    for (let i = 0; i < 3; i + 1) {
      dataSource.push({
        key: i,
        name: `张三 ${i + 1}`,
        role: `院长${i + 1}`,
        status: `启用${i + 1}`,
        email: `hello${i + 1}@sunlands.com`,
      });
    }
    this.state = {
      dataSource: !dataSource ? dataSource : [],
      count: 0,
    };
  }
  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
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
    const columns = !this.columns ? this.columns : [];
    return (
      <PageHeaderLayout>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          + 创建
        </Button>
        <Table bordered dataSource={dataSource} columns={columns} />
      </PageHeaderLayout>
    );
  }
}

export default AccountList;
