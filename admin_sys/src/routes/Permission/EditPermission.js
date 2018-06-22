import React, { Component } from 'react';
import { Form } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import PermissionForm from '../../selfComponent/PermissionForm';

const WrappedRegistrationForm = Form.create()(PermissionForm);
class EditPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <ContentLayout contentForm={<WrappedRegistrationForm jumpFunction={this.props} />} />;
  }
}

export default EditPermission;
