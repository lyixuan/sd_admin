import React, { Component } from 'react';
import { Table, Form, Button, Popconfirm, Row, Col, message, Select, Cascader, Radio } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import EditUserForm from '../../selfComponent/UserForm/EditUserForm.js';
import ContentLayout from '../../layouts/ContentLayout';
import { userTypeDataReset } from '../../utils/dataDictionary';
import common from '../Common/common.css';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

const WrappedRegistrationForm = Form.create()(EditUserForm);

@connect(({ user, loading }) => ({
  user,
  submit: loading.effects['user/updateUserInfo'],
  wechatList: loading.effects['user/wechatList'],
  listOrg: loading.effects['user/listOrg'],
  userList: loading.effects['user/userList'],
}))
class EditUser extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.getUrlParams();
    this.state = {
      mail: !arrValue.mail ? null : arrValue.mail,

      visible: false,
      collegeName: '',
      multiplePoints: 0,
      id: 0,
      effectiveDate: '',
      collegeId: 0,
    };
    console.log(this.state.mail);
  }

  componentDidMount() {
    const wechatListParams = {};
    this.props.dispatch({
      type: 'user/wechatList',
      payload: { wechatListParams },
    });

    const listOrgParams = {};
    this.props.dispatch({
      type: 'user/listOrg',
      payload: { listOrgParams },
    });
    const userListParams = { mail: this.state.mail };
    this.props.dispatch({
      type: 'user/userList',
      payload: { userListParams },
    });
  }
  // 编辑账号函数
  onEdit = key => {
    console.log(key);
    this.setDialogSHow(true);
  };

  setDialogSHow(bol) {
    this.setState({
      visible: bol,
    });
  }

  // // input双向绑定
  // handelChange(e) {
  //   const points = e.target.value;
  //   this.setState({
  //     multiplePoints: points,
  //   });
  // }

  handleSubmit = values => {
    const rname = values.wechatDepartmentName;
    const rUserType = values.userType;
    const len = values.responseCom.length;
    let typeId = rUserType === '家族' ? values.responseCom[1] : values.responseCom[len - 1];
    if (typeof typeId === 'string' || rUserType === '系统管理员' || rUserType === '高级管理员') {
      typeId = undefined;
    }
    let newRoleId = 0;
    const roleList = this.props.user.wechatList.response.data.department;
    roleList.map(item => {
      if (item.name === rname) {
        newRoleId = item.id;
      }
      return 0;
    });
    const updateUserInfoParams = {
      name: values.name.replace(/\s*/g, ''),
      mail: this.state.email,
      mobile: values.phone,
      id: Number(values.id),
      userType: userTypeDataReset[rUserType],
      userTypeId: !typeId ? undefined : typeId,
      wechatDepartmentId: Number(newRoleId),
      wechatDepartmentName: !rname ? undefined : rname,
    };
    // console.log(rUserType,updateUserInfoParams)
    this.props.dispatch({
      type: 'user/updateUserInfo',
      payload: { updateUserInfoParams },
    });
  };

  resetContent = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  // 初始化tabale 列数据
  fillDataSource = () => {
    const data = [];
    data.push({
      key: 1,
      id: 1,
      showName: 'test',
      familyType: '家族长',
      collegeId: 1,
      privilege: '有',
    });
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
        title: '岗位',
        dataIndex: 'userType',
      },
      {
        title: '负责单位',
        dataIndex: 'showName',
      },
      {
        title: '类型',
        dataIndex: 'familyType',
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

  // 模态框回显
  editName = () => {
    if (!this.state.multiplePoints) {
      message.error('投诉扣分倍数不可为空');
      this.setDialogSHow(true);
    } else if (!/(^[1-9]\d*$)/.test(this.state.multiplePoints)) {
      message.error('投诉扣分倍数需要为正整数');
      this.setDialogSHow(true);
    } else {
      const upateComplaintDoublesParams = {
        collegeName: this.state.collegeName,
        multiplePoints: Number(this.state.multiplePoints),
        id: this.state.id,
        effectiveDate: this.state.effectiveDate,
        collegeId: this.state.collegeId,
      };
      this.props.dispatch({
        type: 'complaintDoubles/upateComplaintDoubles',
        payload: { upateComplaintDoublesParams },
      });
      this.setDialogSHow(false);
    }
  };

  handleSelectChange = value => {
    console.log(value);
  };

  render() {
    const columns = this.columnsData();
    const dataSource = this.fillDataSource();
    const { visible } = this.state;
    const formLayout = 'inline';

    const WrappedAdvancedSearchForm = Form.create()(props => {
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*岗&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位:">
                  {getFieldDecorator('userType', {
                    initialValue: [],
                    rules: '',
                  })(
                    <Select style={{ width: 280 }} onChange={this.handleSelectChange}>
                      <Option value="college">院长或副院长</Option>
                      <Option value="family">家族长</Option>
                      <Option value="group">运营长</Option>
                      <Option value="class">班主任</Option>
                      <Option value="admin">管理员</Option>
                      <Option value="boss">管理层</Option>
                      <Option value="others">无绩效岗位</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="负责单位">
                  {getFieldDecorator('responseCom', {
                    initialValue: [],
                    rules: [],
                  })(<Cascader options={[]} style={{ width: 280 }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1} style={{ padding: '3px', textAlign: 'left' }}>
                <FormItem label="*绩效权限">
                  {getFieldDecorator('privilege', {
                    initialValue: 1,
                    rules: [],
                  })(
                    <RadioGroup
                      style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                    >
                      <Radio name="privilege" value={0}>
                        是
                      </Radio>
                      <Radio name="privilege" value={1}>
                        否
                      </Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      );
    });

    const modalContent = (
      <div>
        <Row style={{ marginBottom: '14px' }}>
          <Col span={4} offset={1}>
            姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:
          </Col>
          <Col style={{ textAlign: 'left', fontSize: '14px' }} offset={0}>
            张三
          </Col>
        </Row>
        <Row style={{ marginBottom: '14px' }}>
          <Col span={4} offset={1}>
            性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:
          </Col>
          <Col offset={1} style={{ textAlign: 'left', fontSize: '14px' }}>
            男
          </Col>
        </Row>
        <Row style={{ marginBottom: '14px' }}>
          <Col span={4} offset={1}>
            手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机:
          </Col>
          <Col style={{ textAlign: 'left', fontSize: '14px' }} offset={1}>
            18500469077
          </Col>
        </Row>
        <Row>
          <Col span={4} offset={1} style={{ padding: '3px' }}>
            邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱:
          </Col>
          <Col style={{ textAlign: 'left', fontSize: '14px' }} offset={1}>
            wangjingjing06@sunland.com
          </Col>
        </Row>
        <WrappedAdvancedSearchForm />
      </div>
    );

    return (
      <div>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={
            <WrappedRegistrationForm
              jumpFunction={this.props || {}}
              resetContent={() => {
                this.resetContent();
              }}
              handleSubmit={values => {
                this.handleSubmit(values);
              }}
            />
          }
          contentButton={
            <Button
              style={{ marginTop: '36px' }}
              type="primary"
              className={common.submitButton}
              onClick={() => this.onEdit()}
            >
              添加岗位
            </Button>
          }
          contentTable={
            <Table
              style={{ marginTop: '24px' }}
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              className={common.tableContentStyle}
            />
          }
        />

        <ModalDialog
          title="添加岗位"
          visible={visible}
          modalContent={modalContent}
          clickOK={() => this.editName()}
          footButton={['取消', '提交']}
          showModal={bol => {
            this.setDialogSHow(bol);
          }}
        />
      </div>
    );
  }
}

export default EditUser;
