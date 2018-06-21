import React, { Component } from 'react';
import { Form } from 'antd';
import UserForm from '../../selfComponent/UserForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(UserForm);
class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <ContentLayout contentForm={<WrappedRegistrationForm jumpFunction={this.props} />} />;
  }
}

export default EditUser;
