import React, { Component } from 'react';
import { Table, Button, Form, Input, Popconfirm } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

const FormItem = Form.Item;
let propsVal = '';
class UserList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '手机',
        dataIndex: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '级别',
        dataIndex: 'role',
      },
      {
        title: '负责单位',
        dataIndex: 'responsyCom',
      },
      {
        title: '企业家单位',
        dataIndex: 'comUnit',
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
                {this.state.dataSource.length > 1 ? (
                  <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                    <span style={{ color: '#52C9C2', marginLeft: 12 }}>删除</span>
                  </Popconfirm>
                ) : null}
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
        phone: 18500469077,
        responsyCom: `地球`,
        comUnit: `太空`,
        role: `院长`,
        email: `hello@sunlands.com`,
      },
      {
        key: 2,
        name: `王五`,
        role: `学员`,
        phone: 18500469077,
        responsyCom: `地球`,
        comUnit: `太空`,
        email: `hello@sunlands.com`,
      },
      {
        key: 3,
        name: `赵六`,
        role: `院长`,
        phone: 18500469077,
        responsyCom: `地球`,
        comUnit: `太空`,
        email: `hello@sunlands.com`,
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
    this.props.setRouteUrlParams('/user/editUser', {
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
    this.props.setRouteUrlParams('/user/createUser', { a: 2, b: 3 });
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
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入姓名!',
                  },
                ],
              })(<Input placeholder="请输入姓名" style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem label="手机" style={{ marginLeft: 119 }}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入姓名!',
                  },
                ],
              })(<Input placeholder="请输入手机号" style={{ width: 230, height: 32 }} />)}
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

export default UserList;
