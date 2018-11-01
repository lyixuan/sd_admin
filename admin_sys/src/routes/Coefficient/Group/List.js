
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { assignUrlParams } from 'utils/utils';
import ContentLayout from '../../../layouts/ContentLayout';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import SelfPagination from '../../../selfComponent/selfPagination/SelfPagination';
import common from '../../Common/common.css';


@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/accountList'],
}))
class List extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    const initParams = {
      params: {
        name: '',
        pageNum: 0, // 翻页---当前页码
        pageSize: 30, // 每页显示数据
      },
    };
    this.state = assignUrlParams(initParams, params);
  }

  componentDidMount() {
    this.getData();
  }

  // 编辑
  onEdit = key => {
    this.props.setRouteUrlParams('/performance/groupCoefficient/editor', {
      id: key.id,
    });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };

  getData = params => {
    const stateParams = this.state.params;
    const userListParams = { ...stateParams, ...params };
    // this.props.dispatch({
    //   type: 'user/userList',
    //   payload:{userListParams},
    // });
    this.saveParams(userListParams);
  };

  // 查看详情
  detail = key => {
    this.props.setRouteUrlParams('/performance/groupCoefficient/check', {
      id: key.id,
    });
  };

  saveParams = params => {
    this.setState({ params });
    this.props.setCurrentUrlParams(params);
  };

  // 点击某一页函数
  changePage = (current, size) => {
    const params = {
      number: current > 1 ? current - 1 : 0,
      size,
    };
    this.getData(params);
  };

  // 初始化tabale 列数据
  fillDataSource = () => {
    const data = [{
      key: 1,
      name: 'test',
      id: 2}];
    // val.map((item,index) =>
    //   data.push({
    //     key: index,
    //     name: item.name,
    //     role: item.rname,
    //     email: item.mail, //   const newmail = `${values.mail}@sunlans.com`;
    //     id: item.id,
    //     roleId: item.roleId,
    //   })
    // );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '生肖周期',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/account/editAccount">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.detail(record)}
                >
                  查看详情
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/account/editAccount">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns || [];
  };

  // 创建账号函数
  handleAdd = () => {
    this.props.setRouteUrlParams('/performance/groupCoefficient/create', {});
  };

  render() {
    const { loading } = this.props;
    const { pageNum} = this.state.params;
    const data = []
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    // const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const dataSource =  this.fillDataSource(data.content);
    const columns = this.columnsData();
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <AuthorizedButton authority="/account/createAccount">
            <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
              + 创建
            </Button>
          </AuthorizedButton>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalNum}条</p>
            <Table
              bordered
              loading={loading}
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
            onShowSizeChange={(current, pageSize) => {
              this.onShowSizeChange(current, pageSize);
            }}
            defaultCurrent={pageNum}
            total={totalNum}
            defaultPageSize={30}
            pageSizeOptions={['30']}
          />
        }
      />
    );
  }
}
export default List;

