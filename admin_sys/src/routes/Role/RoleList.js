import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Pagination } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

@connect(({ role, loading }) => ({
  role,
  loading,
}))
class RoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'role/roleList',
      payload: {},
    });
  }

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

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '角色',
        dataIndex: 'name',
        width: '200px',
        key: 'name',
      },
      {
        title: '操作',
        key: 'operation',
        width: '100px',
        render: (text, record) => {
          const { id, name } = record;
          return (
            <div>
              <AuthorizedButton authority="/role/checkRole">
                <span
                  style={{ color: '#52C9C2', marginRight: '20px' }}
                  onClick={() => this.handleNextPage('/role/checkRole', { id, name })}
                >
                  查看详情
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/role/editRole">
                <span
                  style={{ color: '#52C9C2' }}
                  onClick={() => this.handleNextPage('/role/editRole', { id, name })}
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
    const dataSource = !this.props.role.dataList ? [] : this.props.role.dataList.content;
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
