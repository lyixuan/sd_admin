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
    const wechatListParams={}
    this.props.dispatch({
      type: 'user/wechatList',
      payload: {wechatListParams},
    });
  }
  render() {
    return <ContentLayout contentForm={<WrappedRegistrationForm jumpFunction={this.props} />} />;
  }
}

export default EditUser;
