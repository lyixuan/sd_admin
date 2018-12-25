import React, { Component } from 'react';
import { connect } from 'dva';
import { assignUrlParams } from 'utils/utils';
import { Table, Button, Form, Input, Popconfirm, Row, Col, Select } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
import { userTypeData } from '../../utils/dataDictionary';

const FormItem = Form.Item;
const { Option } = Select;
let propsVal = '';

@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/userList'],
}))
class UserList extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    const initParams = {
      params: {
        name: '',
        mail: '',
        isUpdate: 0,
        pageNum: 0, // 翻页---当前页码
        pageSize: 30, // 每页显示数据
      },
    };
    this.state = assignUrlParams(initParams, params);
    this.selectOptions = [
      { value: 0, label: '全部' },
      { value: 1, label: '是' },
      { value: 2, label: '否' },
    ];
  }

  // 页面render之前需要请求的接口
  componentDidMount() {
    this.getData();
  }

  // 删除用户
  onDelete = val => {
    const userDeleteParams = { id: val.id };
    const userListParams = this.state.params;
    this.props.dispatch({
      type: 'user/userDelete',
      payload: { userDeleteParams, userListParams },
    });
  };

  // 更新用户
  onUpdate = val => {
    const updateUserOrgParams = { id: val.id };
    const userListParams = this.state.params;
    this.props.dispatch({
      type: 'user/updateUserOrg',
      payload: { updateUserOrgParams, userListParams },
    });
  };

  // 编辑用户
  onEdit = val => {
    const mail = val.mail || '';
    this.props.setRouteUrlParams('/user/editUser', { mail, userType: val.userType });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, size) => {
    this.changePage(current, size);
  };

  getData = params => {
    const stateParams = this.state.params;
    const userListParams = { ...stateParams, ...params };
    this.props.dispatch({
      type: 'user/userList',
      payload: { userListParams },
    });
    this.saveParams(userListParams);
  };

  saveParams = params => {
    this.setState({ params });
    this.props.setCurrentUrlParams(params);
  };

  // 点击某一页函数
  changePage = (current, size) => {
    const params = {
      pageNum: current > 1 ? current - 1 : 0,
      pageSize: size,
    };
    this.getData(params);
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        name: item.name,
        privilege: item.privilege ? '有' : '无',
        mail: item.entUserId,
        userType: userTypeData[item.userType],
        showName: !item.showName
          ? item.userType === 'others' ? '无绩效岗位' : null
          : item.showName.replace(/,/g, ' | '), // showName.replace(/\,/g,"|")
        changeShowName: !item.changeShowName ? null : item.changeShowName.replace(/,/g, ' | '),
        id: item.id,
        wechatDepartmentId: item.wechatDepartmentId,
        wechatDepartmentName: item.wechatDepartmentName,
        roleName: item.roleName,
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
        title: '前端角色',
        dataIndex: 'userType',
      },
      {
        title: '组织',
        dataIndex: 'showName',
      },
      {
        title: '企业家单位',
        dataIndex: 'changeShowName',
      },
      {
        title: '后端角色',
        dataIndex: 'roleName',
      },
      {
        title: '绩效权限',
        dataIndex: 'privilege',
      },
      {
        title: '操作',
        dataIndex: 'operation',
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
    const params = {
      pageSize: 30,
      pageNum: 0,
      isUpdate: 0,
      name: '',
      mail: '',
    };
    this.getData(params);
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        const isUpdate = this.selectOptions.find(item => item.label === values.isUpdate).value;
        const { mail = undefined } = values;
        const userListParams = {
          isUpdate,
          name: !values.name ? undefined : values.name.replace(/\s*/g, ''),
          mail,
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
    const { name, mail, isUpdate, pageNum } = this.state.params;
    const { userListData = {} } = this.props.user.userList;
    const { totalElements = 0, content = [] } = userListData;
    const dataSource = this.fillDataSource(content);
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
                    initialValue: name,
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
                    initialValue: mail,
                  })(<Input placeholder="请输入邮箱" style={{ width: 140, height: 32 }} />)}
                  <span style={{ width: 100, marginLeft: '6px' }}> @sunlands.com</span>
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <FormItem label="需要更新">
                  {getFieldDecorator('isUpdate', {
                    initialValue: this.selectOptions.find(item => item.value === isUpdate).label,
                  })(
                    <Select placeholder="全部" style={{ width: 230, height: 32 }}>
                      {this.selectOptions.map(item => (
                        <Option value={item.label} key={item.label}>
                          {item.label}
                        </Option>
                      ))}
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
            <p className={common.totalNum}>总数：{totalElements}条</p>
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
            defaultCurrent={pageNum + 1}
            total={totalElements}
            defaultPageSize={30}
          />
        }
      />
    );
  }
}

export default UserList;
