import React, { Component } from 'react';
import { Table, Button, Pagination } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AdvancedSearchForm from '../../common/AdvancedSearchForm';


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
    };
  }
  onEdit = () => {
    this.props.setRouteUrlParams('/account/editAccount', {
      a: 2,
      b: 3,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
  handleAdd = () => {
    this.props.setRouteUrlParams('/account/createAccount', {
      a: 2,
      b: 3,
    });
  };

  render() {
    const { dataSource } = this.state;
    const columns = !this.columns ? [] : this.columns;
    console.log(this.props);
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
