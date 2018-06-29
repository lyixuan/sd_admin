import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, Popconfirm ,Cascader } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

const FormItem = Form.Item;
let propsVal = '';
const residences = [
  {
    value: 'null',
    label: '----',
  },
  {
    value: 'yes',
    label: '是',
  },
  {
    value: 'no',
    label: '否',
  },
];

@connect(({ user, loading }) => ({
  user,
  loading,
}))
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("开始请求接口")
    const userListParams = { name:'mahuishu'};
    this.props.dispatch({
      type: 'user/userList',
      payload: { userListParams },
    });
  }

  // 删除用户
  onDelete = val => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== val.id) });
  };

  // 更新用户
  onUpdate = val => {
    console.log(val);
  };

  // 编辑用户
  onEdit = val => {
    this.props.setRouteUrlParams('/user/editUser', {
      name: val.name,
      phone: val.phone,
      email: val.email,
      role: val.role,
      responseCom: val.responseCom,
    });
  };

  // 初始化tabale 列数据
  fillDataSource = () => {
    // console.log(val)
    const data = [];
    for (let i = 0; i < 50; i += 1) {
      data.push({
        key: i,
        status: `启用`,
        email: `hello${i}@sunlands.com`,
        name: `王五`,
        role: `学员`,
        phone: 18500469077,
        responsyCom: `地球`,
        comUnit: `太空`,
      });
    }
    return data;


    // val.map((item, index) =>
    //   data.push({
    //     key: index,
    //     id: item.id,
    //     permissionName: item.name,
    //     permissionType: item.level === 0 ? '页面功能' : item.level === 1 ? '一级页面' : '二级页面',
    //     permissionRoute: item.resourceUrl,
    //     parentId: item.parentId,
    //     icon: item.iconUrl,
    //     sort: item.sort,
    //   })
    // );




  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
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
                <span style={{ color: '#52C9C2' }} onClick={() => this.onUpdate(record)}>
                  更新
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/user/editUser">
                <span
                  style={{ color: '#52C9C2', marginLeft: 12 }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/user/editUser">
                <Popconfirm title="是否确认删除该用户?" onConfirm={() => this.onDelete(record)}>
                  <span style={{ color: '#52C9C2', marginLeft: 12 }}>删除</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  // 表单重置
  handleReset = () => {
    propsVal.form.resetFields();
    this.props.setCurrentUrlParams({});
  };
  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    let val = {};
    propsVal.form.validateFields((err, values) => {
      val = values;
    });
    this.props.setCurrentUrlParams(val);
  };

  // 创建用户
  handleAdd = () => {
    this.props.setRouteUrlParams('/user/createUser', { a: 2, b: 3 });
  };

  render() {
    console.log(this.props.user.userList)
    // const data = !this.props.user.userList.response
    //   ? []
    //   : !this.props.user.userList.response;
    // const totalNum = !data.totalElements ? 0 : data.totalElements;
    // const dataSource = !data.content ? [] : this.fillDataSource(data.content);


    const dataSource = !this.fillDataSource() ? [] : this.fillDataSource();
    const columns = !this.columnsData() ? [] : this.columnsData();
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
            <FormItem label="手机" >
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入姓名!',
                  },
                ],
              })(<Input placeholder="请输入手机号" style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem label="需要更新" >
              {getFieldDecorator('role', {
                rules: [{ type: 'array', required: true, message: '请选择级别！' }],
              })(<Cascader options={residences}   style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem >
              <div className={common.totalNum}>
                <Button onClick={this.handleSearch} type="primary" className={common.searchButton}>
                  搜 索
                </Button>
                <Button onClick={this.handleReset} type="primary" className={common.cancleButton}>
                  重 置
                </Button>
              </div>
            </FormItem>
          </Form>
        </div>
      );
    });
    return (
      <ContentLayout
        pageHeraderUnvisible="unvisible"
        title="用户列表"
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
            <p className={common.totalNum}>总数：50条</p>
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
