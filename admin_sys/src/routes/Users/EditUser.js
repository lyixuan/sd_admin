import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import UserForm from '../../selfComponent/UserForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(UserForm);
@connect(({ user, loading }) => ({
  user,
  loading,
}))
class EditUser extends Component {
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

  handleSubmit = (values) => {
    console.log(values)
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/user/userList', {});
  };
  render() {
    const userListValue = this.props.user // ? [] : !this.props.user.listOrg.response.data ?[]:this.props.user.wechatList.response.data.department
    console.log(userListValue.listOrg)
    return (!userListValue.wechatList.response  ? [] : !this.props.user.wechatList.response.data ? <div /> :
        (
          <ContentLayout
            contentForm={<WrappedRegistrationForm
              jumpFunction={this.props}
              resetContent={()=>{this.resetContent()}}
              handleSubmit={(values)=>{this.handleSubmit(values)}}
            />}
          />
        )
    );}
}


export default EditUser;
