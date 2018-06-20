import React, { Component } from 'react';
import { Table, Button, Popconfirm, Pagination, Form, Icon, Input, } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AdvancedSearchForm from '../../common/AdvancedSearchForm';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UserList extends Component {
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
              <a href="">编辑</a>
            </Popconfirm>
          ) : null;
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
  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
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
      <PageHeaderLayout>




        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16, marginTop: 20 }}>
          + 创建
        </Button>
        <Table bordered dataSource={dataSource} columns={columns} pagination={false} />
        <Pagination
          style={{ marginTop: 20 }}
          showSizeChanger
          onShowSizeChange={this.onShowSizeChange}
          defaultCurrent={3}
          total={100}
        />
      </PageHeaderLayout>
    );
  }
}

export default UserList;
