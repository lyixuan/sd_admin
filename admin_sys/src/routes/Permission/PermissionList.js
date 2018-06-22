import React, { Component } from 'react';
import { Table, Button, Form, Input } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

const FormItem = Form.Item;
let propsVal = '';
class PermissionList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
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
        dataIndex: 'upId',
      },
      {
        title: '一级页面图标',
        dataIndex: 'icon',
      },
      {
        title: '权限排序',
        dataIndex: 'status',
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
                  onClick={() => this.onEdit(record.key)}
                >
                  编辑
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
        id: 1,
        permissionName: `院长`,
        permissionType: `一级页面`,
        permissionRoute: `hello/word`,
        upId: 1243524,
        icon: ``,
        status: `正序`,
      },
      {
        key: 2,
        id: 2,
        permissionName: `学员`,
        permissionType: `二级页面`,
        permissionRoute: `hello/world`,
        upId: 3454254,
        icon: ``,
        status: `倒序`,
      },
      {
        key: 3,
        id: 3,
        permissionName: `院长`,
        permissionType: `页面功能`,
        permissionRoute: `hello/world`,
        upId: 25662542,
        icon: ``,
        status: `正序`,
      },
    ];

    this.state = {
      dataSource: !dataSource ? [] : dataSource,
    };
  }

  onDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  onEdit = () => {
    this.props.setRouteUrlParams('/permission/editPermission', {
      name: '张三',
      phone: 18500469077,
      email: '191509',
      role: '二级',
      responseCom: '尚德机构',
    });
  };

  handleReset = () => {
    propsVal.form.resetFields();
    this.props.setCurrentUrlParams({});
  };

  handleSearch = e => {
    e.preventDefault();
    let val = {};
    propsVal.form.validateFields((err, values) => {
      val = values;
    });
    this.props.setCurrentUrlParams(val);
  };

  handleAdd = () => {
    this.props.setRouteUrlParams('/permission/createPermission', { a: 2, b: 3 });
  };

  render() {
    const { dataSource } = this.state;
    const columns = !this.columns ? [] : this.columns;
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
              <Button onClick={this.handleSearch} type="primary" className={common.searchButton}>
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
      />
    );
  }
}

export default PermissionList;
