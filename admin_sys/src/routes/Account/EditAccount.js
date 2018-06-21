import React, { Component } from 'react';
import { Form } from 'antd';
import AccountForm from '../../selfComponent/AccountForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(AccountForm);
class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <ContentLayout contentForm={<WrappedRegistrationForm jumpFunction={this.props} />} />;
  }
}

export default EditAccount;
