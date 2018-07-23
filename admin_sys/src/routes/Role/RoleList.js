import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
class RoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getData({ size: 30, number: 0, orderType: 'name' });
  }

  getData = params => {
    const paramsObj = { ...this.props.role.params, ...params };
    this.props.dispatch({
      type: 'role/roleList',
      payload: { paramsObj },
    });
  };

  changePage = (current, pageSize) => {
    console.log(current, pageSize);
    this.getData({ size: pageSize, number: current - 1, orderType: 'name' });
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
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.handleNextPage('/role/checkRole', { id, name })}
                >
                  查看详情
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/role/editRole">
                <span
                  style={{ color: '#52C9C2', cursor: 'pointer' }}
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
    const { dataList } = this.props.role;
    const totalNum = !dataList ? 0 : dataList.totalElements;
    const dataSource = !dataList ? [] : dataList.content;
    const columns = !this.columnsData() ? [] : this.columnsData();

    return (
      <ContentLayout
        pageHeraderUnvisible="unvisible"
        routerData={this.props.routerData}
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
            <p className={common.totalNum}>总数：{totalNum}条</p>
            <Table
              loading={this.props.loading}
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              className={common.tableContentStyle}
            />
          </div>
        }
        contentPagination={
          <SelfPagination
            onChange={(current, pageSize) => {
              this.changePage(current, pageSize);
            }}
            total={totalNum}
          />
        }
      />
    );
  }
}

export default RoleList;
