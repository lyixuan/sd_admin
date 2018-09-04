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
}))
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  // 点击确定按钮请求接口
  handleSubmit = (values,dateString) => {

    const rname = values.wechatDepartmentName;
    const rUserType = values.userType;
    const len = values.responseCom.length;
    let typeId = values.responseCom[len - 1];
    if (typeof typeId === 'string' || rUserType === 'admin' || rUserType === 'boss') {
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
    console.log('提交使用前的参数',values,dateString)
    const userAddParams = {
      name: values.name.replace(/\s*/g, ''),
      mail: values.mail,
      mobile: values.mobile,
      joinDate:dateString,
      idCard:values.idCard,
      sex:values.sex,
      positionList:[
        {
          privilege:values.privilege,
          userType: rUserType,
          userTypeId: typeId,
          wechatDepartmentId: Number(newRoleId),
          wechatDepartmentName: !rname ? undefined : rname,
        },
      ],
    };
    console.log(rUserType,userAddParams)
    // this.props.dispatch({
    //   type: 'user/userAdd',
    //   payload: { userAddParams },
    // });
  };
  // 点击取消按钮跳转到list页面
  resetContent = () => {
    window.history.go(-1);
    // this.props.setRouteUrlParams('/config/userList', {});
  };

  render() {
    // const userListValue = this.props.user;
    return (
      <ContentLayout
        routerData={this.props.routerData}
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
