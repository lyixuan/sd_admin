import React, { Component } from 'react';
import { Form } from 'antd';
import UserForm from '../../selfComponent/UserForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(UserForm);
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  createUser = () => {
    this.props.setRouteUrlParams('/account/accountList', {
      a: 2,
      b: 3,
    });
  };
  render() {
    return <ContentLayout contentForm={<WrappedRegistrationForm />} />;
  }
}

export default CreateUser;
