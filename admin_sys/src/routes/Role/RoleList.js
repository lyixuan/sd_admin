import React, { Component } from 'react';
import { Table, Button, Pagination } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

class RoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  // 初始化tabale 列数据
  fillDataSource = () => {
    const data = [];
    for (let i = 0; i < 50; i += 1) {
      data.push({
        key: i,
        id: i,
        role: `院长`,
      });
    }
    return data;
  };

  // 获取table列表头
  columnsData = () => {
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
    return columns;
  };
  render() {
    const dataSource = !this.fillDataSource() ? [] : this.fillDataSource();
    const columns = !this.columnsData() ? [] : this.columnsData();
    return (
      <ContentLayout
        pageHeraderUnvisible="unvisible"
        title="角色列表"
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
