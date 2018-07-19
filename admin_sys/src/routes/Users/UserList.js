import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, Popconfirm, Cascader } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
import { userTypeData } from '../../utils/dataDictionary';

const FormItem = Form.Item;
let propsVal = '';
let firstName = '';
let firstPhone = '';
let firstUpdate = 0;

const residences = [
  {
    value: 0,
    label: '全部',
  },
  {
    value: 1,
    label: '是',
  },
  {
    value: 2,
    label: '否',
  },
];

@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/userList'],
}))
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const initVal = this.props.getUrlParams();
    firstName = !initVal.firstName ? '' : initVal.firstName;
    firstPhone = !initVal.firstPhone ? '' : initVal.firstPhone;
    firstUpdate = !initVal.firstUpdate ? 0 : initVal.firstUpdate;
    const userListParams = { pageSize: 30, pageNum: 0, isUpdate: !initVal.firstUpdate ? 0 : initVal.firstUpdate  , name: !initVal.firstName ? undefined : initVal.firstName,
      mobile: !initVal.firstPhone ? undefined : initVal.firstPhone};
    this.props.dispatch({
      type: 'user/userList',
      payload: { userListParams },
    });
  }
  componentWillUnmount() {
    firstName = null;
    firstPhone = null;
    firstUpdate = null;
  }

  // 删除用户
  onDelete = val => {
    const userDeleteParams = { id: val.id };
    const userListParams = { pageSize: 30, pageNum: 0, isUpdate: !firstUpdate ? 0 : firstUpdate };
    this.props.dispatch({
      type: 'user/userDelete',
      payload: { userDeleteParams, userListParams },
    });
  };

  // 更新用户
  onUpdate = val => {
    const updateUserOrgParams = { id: val.id };
    const userListParams = { pageSize: 30, pageNum: 0, isUpdate: !firstUpdate ? 0 : firstUpdate };
    this.props.dispatch({
      type: 'user/updateUserOrg',
      payload: { updateUserOrgParams, userListParams },
    });
  };

  // 编辑用户
  onEdit = val => {
    this.props.setRouteUrlParams('/user/editUser', {
      id: val.id,
      userType: val.userType,
    });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, size) => {
    const userListParams = {
      pageSize: size,
      pageNum: current - 1,
      isUpdate: !firstUpdate ? 0 : firstUpdate,
    };
    this.props.dispatch({
      type: 'user/userList',
      payload: { userListParams },
    });
  };

  // 点击某一页函数
  changePage = (current, size) => {
    const userListParams = {
      pageSize: size,
      pageNum: current - 1,
      isUpdate: !firstUpdate ? 0 : firstUpdate,
    };
    this.props.dispatch({
      type: 'user/userList',
      payload: { userListParams },
    });
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    // console.log(val)
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        name: item.name,
        mobile: item.mobile,
        mail: item.entUserId,
        userType: userTypeData[item.userType],
        showName: !item.showName ? null : item.showName.replace(/,/g, ' | '), // showName.replace(/\,/g,"|")
        changeShowName: !item.changeShowName ? null : item.changeShowName.replace(/,/g, ' | '),
        id: item.id,
        wechatDepartmentId: item.wechatDepartmentId,
        wechatDepartmentName: item.wechatDepartmentName,
      })
    );

    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
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
        width: 150,
      },
      {
        title: '企业家单位',
        dataIndex: 'changeShowName',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              {record.changeShowName &&
              record.changeShowName !== '' &&record.userType!=="admib" &&record.userType!=="boss"&&
              record.changeShowName !== record.showName ? (
                <AuthorizedButton authority="/user/checkUser">
                  <span
                    style={{ color: '#52C9C2', cursor: 'pointer' }}
                    onClick={() => this.onUpdate(record)}
                  >
                    更新 |
                  </span>
                </AuthorizedButton>
              ) : null}
              <AuthorizedButton authority="/user/editUser">
                <span
                  style={{ color: '#52C9C2', marginLeft: 4, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑 |
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/user/deleteUser">
                <Popconfirm title="是否确认删除该用户?" onConfirm={() => this.onDelete(record)}>
                  <span style={{ color: '#52C9C2', marginLeft: 4, cursor: 'pointer' }}>删除</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns || [];
  };

  // 表单重置
  handleReset = () => {
    firstName = '';
    firstPhone = '';
    firstUpdate = '';
    this.props.setCurrentUrlParams({
      firstUpdate: null,
      firstName: null,
      firstPhone: null,
    })
    propsVal.form.resetFields();
    this.props.setRouteUrlParams('/config/userList');
    const userListParams = { pageSize: 30, pageNum: 0, isUpdate: !firstUpdate ? 0 : firstUpdate };
    this.props.dispatch({
      type: 'user/userList',
      payload: { userListParams },
    });
  };
  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        firstName = values.name;
        firstPhone = values.mobile;
        const aa = values.isUpdate[0];
        firstUpdate = aa;

        this.props.setCurrentUrlParams({
          firstUpdate: values.isUpdate[0],
          firstName: !values.name ? undefined : values.name,
          firstPhone: !values.mobile ? undefined : values.mobile,
          }
        )

        const userListParams = {
          isUpdate: values.isUpdate[0],
          name: !values.name ? undefined : values.name,
          mobile: !values.mobile ? undefined : values.mobile,
          pageSize: 30,
          pageNum: 0,
        };
        // console.log(userListParams)
        this.props.dispatch({
          type: 'user/userList',
          payload: { userListParams },
        });
      }
    });
  };

  // 创建用户
  handleAdd = () => {
    this.props.setRouteUrlParams('/user/createUser');
  };

  render() {
    const { loading } = this.props;
    const data = !this.props.user.userList.response
      ? []
      : !this.props.user.userList.response.data ? [] : this.props.user.userList.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = this.columnsData();
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                initialValue: firstName,
                rules: [
                  // { max: 50, message: '您输入姓名不合法!', whitespace: true },
                  {
                    validator(rule, value, callback) {
                      const reg = !value ? '' : value.replace(/(^\s*)|(\s*$)/g, '');
                      if (reg.length > 50) {
                        callback({ message: '姓名最长为50个字符!' });
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(<Input placeholder="请输入姓名" style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem label="手机">
              {getFieldDecorator('mobile', {
                initialValue: firstPhone,
              })(<Input placeholder="请输入手机号" style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem label="需要更新">
              {getFieldDecorator('isUpdate', {
                initialValue: [!firstUpdate ? 0 : firstUpdate],
              })(<Cascader options={residences} style={{ width: 230, height: 32 }} />)}
            </FormItem>
            <FormItem>
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

export default UserList;
