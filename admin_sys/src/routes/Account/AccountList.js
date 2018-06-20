import React, { Component } from 'react';
import { Table, Button, Pagination } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import styles from './Account.css';

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
            <AuthorizedButton authority="/account/editAccount">
              <span style={{ color: '#52C9C2' }} onClick={() => this.onEdit(record.key)}>
                编辑
              </span>
            </AuthorizedButton>
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
    return (
      <ContentLayout
        contentButton={
          <AuthorizedButton authority="/account/createAccount">
            <Button onClick={this.handleAdd} type="primary" className={styles.createButton}>
              + 创建
            </Button>
          </AuthorizedButton>
        }
        contentTable={
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            className={styles.tableContentStyle}
          />
        }
        contentPagination={
          <Pagination
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            defaultCurrent={1}
            total={100}
            className={styles.paginationStyle}
          />
        }
      />
    );
  }
}
export default AccountList;
