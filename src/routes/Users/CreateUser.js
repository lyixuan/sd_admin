import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import CreateUserForm from '../../selfComponent/UserForm/CreateUserForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(CreateUserForm);
@connect(({ user, loading }) => ({
  user,
  submit: loading.effects['user/userAdd'],
  wechatList: loading.effects['user/wechatList'],
  listOrg: loading.effects['user/listOrg'],
  roleOrg: loading.effects['user/getUserRoleList'],
}))
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const params = {};
    this.props.dispatch({
      type: 'user/wechatList',
      payload: { params },
    });

    this.props.dispatch({
      type: 'user/listOrg',
      payload: { params },
    });

    this.props.dispatch({
      type: 'user/getUserRoleList',
      payload: { params },
    });
  }

  // 点击确定按钮请求接口
  handleSubmit = (values, dateString) => {
    const rname = values.wechatDepartmentName;
    const rUserType = values.userType;
    const len = !values.responseCom ? null : values.responseCom.length;
    let typeId = !len ? undefined : values.responseCom[len - 1];
    if (
      typeof typeId === 'string' ||
      rUserType === 'admin' ||
      rUserType === 'boss' ||
      rUserType === 'others'
    ) {
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
    const { view = [] } = values;
    const bol = true;
    let scoreView = false;
    let privilegeView = false;
    let endView = false;
    let incomeKpiView = false;
    view.map(item => {
      if (item === 'scoreView') {
        scoreView = bol;
      } else if (item === 'privilegeView') {
        privilegeView = bol;
      } else if (item === 'endView') {
        endView = bol;
      } else if (item === 'incomeKpiView') {
        incomeKpiView = bol;
      }
      return 0;
    });
    const userAddParams = {
      name: values.name.replace(/\s*/g, ''),
      mail: values.mail,
      mobile: values.mobile,
      joinDate: dateString,
      idCard: values.idCard,
      sex: values.sex,
      roleId: Number(values.roleId),
      city: values.city,
      scoreView,
      privilegeView,
      endView,
      incomeKpiView,
      positionList: {
        privilege: rUserType === 'admin' ? false : values.privilege === 1,
        userType: rUserType,
        userTypeId: typeId,
        wechatDepartmentId: Number(newRoleId),
        wechatDepartmentName: !rname ? undefined : rname,
      },
    };
    this.props.dispatch({
      type: 'user/userAdd',
      payload: { userAddParams },
    });
  };
  // 点击取消按钮跳转到list页面
  resetContent = () => {
    window.history.go(-1);
  };

  render() {
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <WrappedRegistrationForm
            jumpFunction={this.props}
            resetContent={() => {
              this.resetContent();
            }}
            handleSubmit={(values, dataString) => {
              this.handleSubmit(values, dataString);
            }}
          />
        }
      />
    );
  }
}

export default CreateUser;
