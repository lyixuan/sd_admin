import React, { Component } from 'react';
import { Table, Button } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import styles from '../Account/Account.css';
import common from '../Common/common.css';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
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
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/user/checkUser">
                <span style={{ color: '#52C9C2' }} onClick={() => this.onEdit(record.key)}>
                  更新
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/user/editUser">
                <span
                  style={{ color: '#52C9C2', marginLeft: 12 }}
                  onClick={() => this.onEdit(record.key)}
                >
                  编辑
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/user/editUser">
                <span
                  style={{ color: '#52C9C2', marginLeft: 12 }}
                  onClick={() => this.onEdit(record.key)}
                >
                  删除
                </span>
              </AuthorizedButton>
            </div>
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
    this.props.setRouteUrlParams('/user/editUser', {
      a: 2,
      b: 3,
    });
  };

  handleAdd = () => {
    this.props.setRouteUrlParams('/user/createUser', {
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
          <AuthorizedButton authority="/user/createUser">
            <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
              创建
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
      />
    );
  }
}

export default UserList;
