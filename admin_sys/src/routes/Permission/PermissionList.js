import React, { Component } from 'react';
import { Table, Button, Form, Input } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

const FormItem = Form.Item;
let propsVal = '';
@connect(({ permission, loading }) => ({
  permission,
  loading,
}))
class PermissionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const permissionListParams = {size: 50, number: 0};
    this.props.dispatch({
      type: 'permission/permissionList',
      payload: { permissionListParams },
    });
  }

  // 权限编辑
  onEdit = val => {
    console.log(val)
    this.props.setRouteUrlParams('/permission/editPermission', {
      permissionName: val.permissionName,
      permissionType: val.permissionType,
      permissionRoute: val.permissionRoute,
      parentId: val.parentId,
      sort: val.sort,
      icon: val.icon,
      id: val.id,
      from: 'edit',
    });
  };

  // 表单重置
  handleReset = () => {
    propsVal.form.resetFields();
    this.props.setCurrentUrlParams({});
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        const permissionListParams = { name: values.name };
        console.log(permissionListParams);
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
        permissionName: item.name,
        permissionType: item.level === 0 ? '页面功能' : item.level === 1 ? '一级页面' : '二级页面',
        permissionRoute: item.resourceUrl,
        parentId: item.parentId,
        icon: item.iconUrl,
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
        dataIndex: 'permissionName',
      },
      {
        title: '权限类型',
        dataIndex: 'permissionType',
      },
      {
        title: '权限路由',
        dataIndex: 'permissionRoute',
      },
      {
        title: '上级编号',
        dataIndex: 'parentId',
      },
      {
        title: '一级页面图标',
        dataIndex: 'icon',
        render: record => {
          return (
            // !record ? <span>{!record?'':record}</span>:<img src={record} alt='上一级页面图标' />
            <span>{record}</span>
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
    // console.log(this.props.permission.permissionListAllName)
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
                rules: [
                  {
                    required: true,
                    message: '请权限名称!',
                  },
                ],
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
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              className={common.tableContentStyle}
            />
          </div>
        }
      />
    );
  }
}

export default PermissionList;
