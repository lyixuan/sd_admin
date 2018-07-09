import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import UserForm from '../../selfComponent/UserForm.js';
import ContentLayout from '../../layouts/ContentLayout';
import { userTypeDataReset } from '../../utils/dataDictionary';
import { message } from 'antd/lib/index';

const WrappedRegistrationForm = Form.create()(UserForm);
@connect(({ user, loading }) => ({
  user,
  loading,
}))
class EditUser extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.getUrlParams();
    this.state = {
      id: !arrValue.id ? null : arrValue.id,
    };
    console.log(this.state);
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
  }

  handleSubmit = values => {
    console.log(values);
    const rname = values.wechatDepartmentName[0];
    const rUserType = values.userType[0];
    const len = values.responseCom.length;
    let typeId = values.responseCom[len - 1];
    if (typeof typeId === 'string' || rUserType === '系统管理员' || rUserType === '高级管理员') {
      typeId = undefined;
    }else {
      const aa = !typeId?message.error('请选择负责单位'):null;
      return aa;
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
      name: values.name,
      mail: `${values.email}@sunlans.com`,
      mobile: values.phone,
      id: Number(this.state.id),
      userType: userTypeDataReset[rUserType],
      userTypeId: !typeId ? undefined : typeId,
      wechatDepartmentId: Number(newRoleId),
      wechatDepartmentName: !rname ? undefined : rname,
    };
    console.log(updateUserInfoParams);
    this.props.dispatch({
      type: 'user/updateUserInfo',
      payload: { updateUserInfoParams },
    });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/user/userList', {});
  };
  render() {
    const userListValue = this.props.user; // ? [] : !this.props.user.listOrg.response.data ?[]:this.props.user.wechatList.response.data.department
    // console.log(userListValue.listOrg)
    return !userListValue.wechatList.response ? (
      []
    ) : !this.props.user.wechatList.response.data ? (
      <div />
    ) : !userListValue.listOrg.response ? (
      []
    ) : !userListValue.listOrg.response.data ? (
      <div />
    ) : (
      <ContentLayout
        contentForm={
          <WrappedRegistrationForm
            jumpFunction={this.props}
            resetContent={() => {
              this.resetContent();
            }}
            handleSubmit={values => {
              this.handleSubmit(values);
            }}
          />
        }
      />
    );
  }
}

export default EditUser;
