import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, Popconfirm, Row, Col, Select } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
import { userTypeData, isUpdateDataReset } from '../../utils/dataDictionary';

const FormItem = Form.Item;
const { Option } = Select;
let propsVal = '';

// 添加全局变量 ，记录搜索或是跳转到某一页到编辑页面之后返回到list页面回显所用。
let firstName = ''; // 搜索框的姓名字段
let firstMail = ''; // 搜索框的邮箱字段
let firstUpdate = '全部'; // 搜索框的需要更新字段
let firstPage = 0; // 分页的默认起开页面

@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/userList'],
}))
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 页面render之前需要请求的接口
  componentDidMount() {
    const initVal = this.props.getUrlParams();
    firstName = !initVal.firstName ? '' : initVal.firstName;
    firstMail = !initVal.firstMail ? '' : initVal.firstMail;
    firstUpdate = !initVal.firstUpdate ? '全部' : initVal.firstUpdate;
    firstPage = !initVal.firstPage ? 0 : Number(initVal.firstPage);
    const userListParams = {
      pageSize: 30,
      pageNum: !firstPage ? 0 : firstPage,
      isUpdate: !firstUpdate ? 0 : isUpdateDataReset[firstUpdate],
      name: !firstName ? undefined : firstName,
      mail: !firstMail ? undefined : firstMail,
    };
    this.getData(userListParams);
  }
  // 组件卸载时清除声明的变量
  componentWillUnmount() {
    firstName = null;
    firstMail = null;
    firstUpdate = null;
    firstPage = null;
  }

  // 删除用户
  onDelete = val => {
    const mail = val.mail || '';
    const newmail = mail.substring(0, mail.indexOf('@'));
    const userDeleteParams = { mail: newmail };
    const userListParams = {
      pageSize: 30,
      pageNum: !firstPage ? 0 : firstPage,
      isUpdate: !firstUpdate ? 0 : isUpdateDataReset[firstUpdate],
      name: !firstName ? undefined : firstName,
      mail: !firstMail ? undefined : firstMail,
    };
    this.props.dispatch({
      type: 'user/userDelete',
      payload: { userDeleteParams, userListParams },
    });
  };

  // 更新用户
  onUpdate = val => {
    const updateUserOrgParams = { id: val.id };
    const userListParams = {
      pageSize: 30,
      pageNum: !firstPage ? 0 : firstPage,
      isUpdate: !firstUpdate ? 0 : isUpdateDataReset[firstUpdate],
      name: !firstName ? undefined : firstName,
      mail: !firstMail ? undefined : firstMail,
    };
    this.props.dispatch({
      type: 'user/updateUserOrg',
      payload: { updateUserOrgParams, userListParams },
    });
  };

  // 编辑用户
  onEdit = val => {
    const mail = val.mail || '';
    const newmail = mail.substring(0, mail.indexOf('@'));
    this.props.setRouteUrlParams('/user/editUser', {
      mail: newmail,
      userType: val.userType,
    });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, size) => {
    this.changePage(current, size);
  };

  getData = userListParams => {
    this.props.dispatch({
      type: 'user/userList',
      payload: { userListParams },
    });
  };

  savaParams = params => {
    this.props.setCurrentUrlParams(params);
  };

  // 点击某一页函数
  changePage = (current, size) => {
    firstPage = current - 1;
    this.savaParams({
      firstPage: !firstPage ? 0 : firstPage,
    });
    const userListParams = {
      pageSize: size,
      pageNum: current - 1,
      isUpdate: !firstUpdate ? 0 : isUpdateDataReset[firstUpdate],
      name: !firstName ? undefined : firstName,
      mail: !firstMail ? undefined : firstMail,
    };
    this.getData(userListParams);
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        name: item.name,
        privilege: item.privilege === 0 ? '有' : '无',
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
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'mail',
      },
      {
        title: '级别',
        dataIndex: 'userType',
        width: 120,
      },
      {
        title: '负责单位',
        dataIndex: 'showName',
        width: 170,
      },
      {
        title: '企业家单位',
        dataIndex: 'changeShowName',
        width: 170,
      },
      {
        title: '绩效权限',
        dataIndex: 'privilege',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 150,
        render: (text, record) => {
          return (
            <div>
              {record.changeShowName &&
              record.changeShowName !== '' &&
              (record.userType !== 'admin' || record.userType !== 'boss') &&
              record.changeShowName !== record.showName ? (
                record.privilege === '有' ? null : (
                  <AuthorizedButton authority="/user/updateUser">
                    <span
                      style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                      onClick={() => this.onUpdate(record)}
                    >
                      更新
                    </span>
                  </AuthorizedButton>
                )
              ) : null}
              <AuthorizedButton authority="/user/editUser">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
              {record.privilege === '有' ? null : (
                <AuthorizedButton authority="/user/deleteUser">
                  <Popconfirm title="是否确认删除该用户?" onConfirm={() => this.onDelete(record)}>
                    <span style={{ color: '#52C9C2', cursor: 'pointer' }}>删除</span>
                  </Popconfirm>
                </AuthorizedButton>
              )}
            </div>
          );
        },
      },
    ];
    return columns || [];
  };

  // 表单重置
  handleReset = () => {
    propsVal.form.resetFields();
    firstName = '';
    firstMail = '';
    firstUpdate = '全部';
    firstPage = 0;
    this.props.setRouteUrlParams('/config/userList');
    this.getData({ pageSize: 30, pageNum: 0, isUpdate: 0 });
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        firstName = !values.name ? undefined : values.name.replace(/\s*/g, '');
        firstMail = !values.mail ? undefined : values.mail;
        firstUpdate = !values.isUpdate ? '全部' : values.isUpdate;
        firstPage = 0;
        this.savaParams({
          firstUpdate,
          firstName,
          firstMail,
          firstPage: 0,
        });
        const userListParams = {
          isUpdate: isUpdateDataReset[firstUpdate],
          name: !values.name ? undefined : values.name.replace(/\s*/g, ''),
          mail: !values.mail ? undefined : values.mail,
          pageSize: 30,
          pageNum: 0,
        };
        this.getData(userListParams);
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
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="姓名">
                  {getFieldDecorator('name', {
                    initialValue: firstName,
                    rules: [
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
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <FormItem label="邮箱">
                  {getFieldDecorator('mail', {
                    initialValue: firstMail,
                  })(<Input placeholder="请输入邮箱" style={{ width: 140, height: 32 }} />)}
                  <span style={{ width: 100, marginLeft: '6px' }}> @sunlands.com</span>
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <FormItem label="需要更新">
                  {getFieldDecorator('isUpdate', {
                    initialValue: !firstUpdate ? '全部' : firstUpdate,
                  })(
                    <Select placeholder="全部" style={{ width: 230, height: 32 }}>
                      <Option value="全部">全部</Option>
                      <Option value="是">是</Option>
                      <Option value="否">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right', marginTop: '12px' }}>
                <FormItem>
                  <div>
                    <Button htmlType="submit" type="primary" className={common.searchButton}>
                      搜 索
                    </Button>
                    <Button
                      onClick={this.handleReset}
                      type="primary"
                      className={common.resetButton}
                    >
                      重 置
                    </Button>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      );
    });
    return (
      <ContentLayout
        routerData={this.props.routerData}
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
            defaultCurrent={firstPage + 1}
            total={totalNum}
            defaultPageSize={30}
          />
        }
      />
    );
  }
}

export default UserList;
