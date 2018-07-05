import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import UserForm from '../../selfComponent/UserForm.js';
import ContentLayout from '../../layouts/ContentLayout';
import { userTypeDataReset } from '../../utils/dataDictionary';

const WrappedRegistrationForm = Form.create()(UserForm);
@connect(({ user, loading }) => ({
  user,
  loading,
}))
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    const rname = values.wechatDepartmentName[0];
    const rUserType = values.userType[0];
    const len = values.responseCom.length;
    let typeId = values.responseCom[len - 1];
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
    const userAddParams = {
      name: values.name,
      mail: `${values.email}@sunlans.com`,
      mobile: values.phone,
      userType: userTypeDataReset[rUserType],
      userTypeId: typeId,
      wechatDepartmentId: Number(newRoleId),
      wechatDepartmentName: !rname ? undefined : rname,
    };
    console.log(userAddParams);
    this.props.dispatch({
      type: 'user/userAdd',
      payload: { userAddParams },
    });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/user/userList', {});
  };
  render() {
    const aa = this.props.user.listOrg.response; // ? [] : !this.props.user.listOrg.response.data ?[]:this.props.user.wechatList.response.data.department
    console.log(aa);
    return !this.props.user.wechatList.response ? (
      []
    ) : !this.props.user.wechatList.response.data ? (
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

export default CreateUser;
