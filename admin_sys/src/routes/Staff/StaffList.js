import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, Popconfirm, Row, Col, Select } from 'antd';
import { assignUrlParams } from 'utils/utils';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
// import { userTypeData } from '../../utils/dataDictionary';

const FormItem = Form.Item;
const { Option } = Select;
let propsVal = '';

const groupTypeObj = {
  college: '院长或副院长',
  family: '家族长',
  group: '运营长',
  class: '班主任',
};
const jobStatus = {
  全部: null,
  在岗: 0,
  休假中: 1,
  已离职: 2,
  待转岗: 3,
  待休假: 4,
  待离职: 5,
};

@connect(({ staff, loading }) => ({
  staff,
  loading: loading.effects['staff/staffList'],
}))
class StaffList extends Component {
  constructor(props) {
    const { urlParams = {} } = props;
    super(props);
    const initState = {
      paramsObj: {
        name: '', // 员工姓名
        mail: '', // 邮箱
        number: 0, // 当前页
        size: 30, // 页条数
        orderType: 'modifyTime', // 排序字段
        status: null, // 员工状态
      },
    };
    this.state = assignUrlParams(initState, urlParams);
  }

  // 页面render之前需要请求的接口
  componentDidMount() {
    this.getData();
  }

  // 删除用户
  // onDelete = val => {
  // };

  // 更新用户
  // onUpdate = val => {

  // };

  // 编辑用户
  onEdit = val => {
    this.props.setRouteUrlParams('/user/editUser', {
      id: val.id,
      userType: val.userType,
    });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, size) => {
    this.changePage(current, size);
  };

  getData = (filterParams = {}) => {
    const { paramsObj } = this.state;
    const sendParams = {
      ...paramsObj,
      ...filterParams,
    };
    this.props.dispatch({
      type: 'staff/staffList',
      payload: sendParams,
    });
    this.savaParams(sendParams);
  };

  savaParams = paramsObj => {
    this.props.setCurrentUrlParams(paramsObj);
    if (JSON.stringify(paramsObj) !== JSON.stringify(this.state.paramsObj)) {
      this.setState({ paramsObj });
    }
  };

  // 点击某一页函数
  changePage = (current, size) => {
    // firstPage = current - 1;
    // this.savaParams({
    //   firstPage: !firstPage ? 0 : firstPage,
    // });
    // const userListParams = {
    //   pageSize: size,
    //   pageNum: current - 1,
    //   isUpdate: !firstUpdate ? 0 : isUpdateDataReset[firstUpdate],
    //   name: !firstName ? undefined : firstName,
    //   mobile: !firstPhone ? undefined : firstPhone,
    // };
    this.getData(size);
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '状态',
        dataIndex: 'currentStateName',
        width: 120,
        key: 'currentStateName',
      },
      {
        title: '邮箱',
        dataIndex: 'mail',
        width: 150,
        key: 'mail',
      },
      {
        title: '岗位',
        dataIndex: 'userType',
        width: 110,
        key: 'userType',
      },
      {
        title: '负责单位',
        dataIndex: 'showName',
        width: 170,
        key: 'showName',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 150,
        key: 'operation',
        render: (text, record) => {
          return (
            <div>
              {record.changeShowName &&
              record.changeShowName !== '' &&
              (record.userType !== 'admin' || record.userType !== 'boss') &&
              record.changeShowName !== record.showName ? (
                <AuthorizedButton authority="/user/updateUser">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.onUpdate(record)}
                  >
                    更新
                  </span>
                </AuthorizedButton>
              ) : null}
              <AuthorizedButton authority="/user/editUser">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/user/deleteUser">
                <Popconfirm title="是否确认删除该用户?" onConfirm={() => this.onDelete(record)}>
                  <span style={{ color: '#52C9C2', cursor: 'pointer' }}>删除</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns || [];
  };
  formaterData = (data = []) => {
    return data.map(item => {
      const mail = typeof item.mail === 'string' ? item.mail : '';

      return {
        ...item,
        mail: mail.split('@')[0],
        userType: groupTypeObj[item.userType],
        key: item.id,
      };
    });
  };

  // 表单重置
  handleReset = () => {
    const paramsObj = {
      name: '',
      mail: '',
      number: 0,
      size: 30,
      status: null, // 员工状态
    };
    this.getData(paramsObj);
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        const { name, mail, status } = values;
        console.log(values);
        const paramsObj = {
          name,
          mail,
          status,
        };
        this.getData(paramsObj);
      }
    });
  };

  // 创建用户
  handleAdd = () => {
    this.props.setRouteUrlParams('/user/createUser');
  };

  render() {
    const { paramsObj } = this.state;
    const { loading } = this.props;
    const dataSource = this.formaterData(this.props.staff.staffList);

    //   ? []
    //   : !this.props.user.userList.response.data ? [] : this.props.user.userList.response.data;
    // const totalNum = !data.totalElements ? 0 : data.totalElements;
    // const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout="inline" onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="姓名">
                  {getFieldDecorator('name', {
                    initialValue: paramsObj.name,
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
                    initialValue: paramsObj.mail,
                  })(<Input placeholder="请输入邮箱" style={{ width: 230, height: 32 }} />)}
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <FormItem label="状态">
                  {getFieldDecorator('status', {
                    initialValue:
                      Object.keys(jobStatus).find(item => jobStatus[item] == paramsObj.status) ||
                      '全部',
                  })(
                    <Select placeholder="全部" style={{ width: 230, height: 32 }}>
                      {Object.keys(jobStatus).map(item => (
                        <Option value={jobStatus[item]} key={item}>
                          {item}
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
        //     contentButton={
        //       <AuthorizedButton authority="/user/createUser">
        //         <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
        //           创 建
        //         </Button>
        //       </AuthorizedButton>
        //     }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{dataSource.length}条</p>
            <Table
              bordered
              loading={loading}
              dataSource={dataSource}
              columns={this.columnsData()}
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
            defaultCurrent={paramsObj.number + 1}
            total={10}
            defaultPageSize={30}
          />
        }
      />
    );
  }
}

export default StaffList;
