import React, { Component } from 'react';
import { Table, Button, Pagination } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

class RoleList extends Component {
  constructor(props) {
    super(props);

    const dataSource = [
      {
        key: 1,
        id: 1,
        role: `院长`,
      },
      {
        key: 2,
        id: 2,
        role: `学员`,
      },
      {
        key: 3,
        id: 3,
        role: `院长`,
      },
    ];

    this.state = {
      dataSource: !dataSource ? [] : dataSource,
    };
  }

  componentDidMount() {}
  onChange = val => {
    this.getData({ current: val });
  };
  onShowSizeChange = (current, pageSize) => {
    this.getData({ current, pageSize });
  };

  getData = params => {
    const sendObj = { ...this.props.role.params, ...params };
    this.props.dispatch({
      type: 'role/roleList',
      payload: sendObj,
    });
    this.props.setCullectUrlParams(sendObj);
  };
  handleNextPage = (pathName, params) => {
    this.props.setRouteUrlParams(pathName, params);
  };
  render() {
    const { dataSource } = this.state;
    const columns = [
      {
        title: '角色',
        dataIndex: 'role',
        width: '200px',
        key: 'role',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '100px',
        key: 'action',
        render: (text, record) => {
          const { id } = record;
          return (
            <div>
              <AuthorizedButton authority="/role/checkRole">
                <span
                  style={{ color: '#52C9C2', marginRight: '20px' }}
                  onClick={() => this.handleNextPage('/role/checkRole', { id })}
                >
                  查看详情
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/role/editRole">
                <span
                  style={{ color: '#52C9C2' }}
                  onClick={() => this.handleNextPage('/role/editRole', { id })}
                >
                  编辑
                </span>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return (
      <ContentLayout
        pageHeraderUnvisible="unvisible"
        contentButton={
          <AuthorizedButton authority="/role/createRole">
            <Button
              onClick={() => this.handleNextPage('/role/createRole', null)}
              type="primary"
              className={common.createButton}
            >
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
            onShowSizeChange={this.onShowSizeChange}
            defaultCurrent={1}
            total={100}
            onChange={this.onChange}
            className={common.paginationStyle}
          />
        }
      />
    );
  }
}

export default RoleList;
