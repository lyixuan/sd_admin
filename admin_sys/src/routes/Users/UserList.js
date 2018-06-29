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
    value: 'no',
    label: '----',
  },
  {
    value: 'true',
    label: '是',
  },
  {
    value: 'false',
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
    const userListParams = { };
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
      phone: val.mobile,
      email: val.mail,
      role: val.showName,
      responseCom: val.changeShowName,
    });
  };

  // 初始化tabale 列数据
  fillDataSource = (val) => {
    console.log(val)
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        name: item.name,
        mobile: item.mobile,
        mail: `${item.entUserId}@sunlans.com`,
        userType: item.userType==='college'?'学院':item.userType==="family"?'家族':item.userType==='group'?'小组':item.userType==='admin'?'系统管理员':item.userType==='boss'?'高级管理员':'无底表权限', // 需转为中文
        showName: item.showName,
        changeShowName: item.changeShowName,
        id:item.id,
      })
    );

    return data;
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
        dataIndex: 'mobile',
      },
      {
        title: '邮箱',
        dataIndex: 'mail',
      },
      {
        title: '级别',
        dataIndex: 'userType',
      },
      {
        title: '负责单位',
        dataIndex: 'showName',
      },
      {
        title: '企业家单位',
        dataIndex: 'changeShowName',
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
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        console.log('进入开始请求')
        const userListParams = {isUpdate:values.isUpdate==='no'?true:values.isUpdate,name:values.name,mobile:values.mobile };
        this.props.dispatch({
          type: 'user/userList',
          payload: { userListParams },
        });
      }
    });
  };

  // 创建用户
  handleAdd = () => {
    this.props.setRouteUrlParams('/user/createUser', { a: 2, b: 3 });
  };

  render() {
    const data = !this.props.user.userList.response
      ? []
      : this.props.user.userList.response;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);

    console.log(dataSource)
    // const dataSource = !this.fillDataSource() ? [] : this.fillDataSource();
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
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入姓名!',
                  },
                ],
              })(<Input placeholder="请输入手机号" style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem label="需要更新" >
              {getFieldDecorator('isUpdate', {
                rules: [{ type: 'array', required: true, message: '请选择级别！' }],
              })(<Cascader options={residences}   style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem >
              <div className={common.totalNum}>
                <Button htmlType="submit" type="primary" className={common.searchButton}>
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

export default UserList;
