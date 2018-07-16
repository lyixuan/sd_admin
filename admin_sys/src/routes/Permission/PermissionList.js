import React, { Component } from 'react';
import { Table, Button, Form, Input } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
import {levelData} from '../../utils/dataDictionary';

const FormItem = Form.Item;
let propsVal = '';
let firstName = '';
@connect(({ permission, loading }) => ({
  permission,
  loading: loading.models.permission,
}))
class PermissionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const permissionListParams = {size: 30, number: 0,sort:'id'};
    this.props.dispatch({
      type: 'permission/permissionList',
      payload: { permissionListParams },
    });
  }
  componentWillUnmount() {
    firstName = null;
  }
  // 权限编辑
  onEdit = val => {
    console.log(val)
    this.props.setRouteUrlParams('/permission/editPermission', {
      id: val.id,
    });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    const permissionListParams = {size: pageSize, number: current - 1,sort:'id' };
    this.props.dispatch({
      type: 'permission/permissionList',
      payload: { permissionListParams },
    });
  };

  // 点击某一页函数
  changePage = (current, pageSize) => {
    const permissionListParams = {size: pageSize, number: current - 1 ,sort:'id'};
    this.props.dispatch({
      type: 'permission/permissionList',
      payload: { permissionListParams },
    });
  };

  // 表单重置
  handleReset = () => {
    firstName = '';
    propsVal.form.resetFields();
    const permissionListParams = {size: 30, number: 0 , sort:'id'};
    this.props.dispatch({
      type: 'permission/permissionList',
      payload: { permissionListParams },
    });
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        firstName = values.name;
        const permissionListParams = { name: !values.name?undefined:values.name ,sort:'id',size: 30, number: 0 };
        this.props.dispatch({
          type: 'permission/permissionList',
          payload: { permissionListParams },
        });
      }
    });
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        id: item.id,
        name: item.name,
        level: levelData[item.level],
        resourceUrl: item.resourceUrl,
        parentId: item.parentId,
        iconUrl: item.iconUrl,
        sort: item.sort,
      })
    );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '权限名称',
        dataIndex: 'name',
      },
      {
        title: '权限类型',
        dataIndex: 'level',
      },
      {
        title: '权限路由',
        dataIndex: 'resourceUrl',
      },
      {
        title: '上级编号',
        dataIndex: 'parentId',
      },
      {
        title: '一级页面图标',
        dataIndex: 'iconUrl',
        render: record => {
          return (
            !record ? <span>{!record?'':record}</span>:<img src={record} alt='上一级页面图标' />
            // <span>{record}</span>
          );
        },
      },
      {
        title: '权限排序',
        dataIndex: 'sort',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/permission/editPermission">
                <span
                  style={{ color: '#52C9C2', marginLeft: 12 }}
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
    return columns;
  };

  // 创建权限
  handleAdd = () => {
    this.props.setRouteUrlParams('/permission/createPermission', { a: 2, b: 3 });
  };

  render() {
    const { loading } = this.props;
    const data = !this.props.permission.permissionList.response
      ? []
      : !this.props.permission.permissionList.response.data
        ? []
        : this.props.permission.permissionList.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = !this.columnsData() ? [] : this.columnsData();
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <FormItem label="权限名称">
              {getFieldDecorator('name', {
                initialValue: firstName,
              })(<Input placeholder="请输入权限名称" style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem style={{ marginLeft: 119 }}>
              <Button htmlType="submit" type="primary" className={common.searchButton}>
                搜 索
              </Button>
              <Button onClick={this.handleReset} type="primary" className={common.cancleButton}>
                重 置
              </Button>
            </FormItem>
          </Form>
        </div>
      );
    });
    return (
      <ContentLayout
        pageHeraderUnvisible="unvisible"
        title="权限列表"
        contentForm={<WrappedAdvancedSearchForm />}
        contentButton={
          <AuthorizedButton authority="/user/createUser">
            <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
              创 建
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
            defaultCurrent={1}
            total={totalNum}
            defaultPageSize={30}
            pageSizeOptions={['30']}
          />
      }
      />
    );
  }
}

export default PermissionList;
