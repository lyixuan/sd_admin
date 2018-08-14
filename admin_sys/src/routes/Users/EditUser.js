import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import UserForm from '../../selfComponent/UserForm.js';
import ContentLayout from '../../layouts/ContentLayout';
import { userTypeDataReset } from '../../utils/dataDictionary';

const WrappedRegistrationForm = Form.create()(UserForm);

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
      id: !arrValue.id ? null : arrValue.id,
    };
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
    const userListParams = { id: this.state.id };
    this.props.dispatch({
      type: 'user/userList',
      payload: { userListParams },
    });
  }

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
      mail: values.email,
      mobile: values.phone,
      id: Number(this.state.id),
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

  render() {
    // const userListValue = this.props.user;
    // const {data = {}} = userListValue.userList.response;
    // console.log(userListValue.userList)
    return (
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
      />
    );
  }
}

export default EditUser;
