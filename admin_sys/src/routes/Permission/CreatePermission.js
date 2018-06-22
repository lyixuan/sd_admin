import React, { Component } from 'react';
import { Form } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import PermissionForm from '../../selfComponent/PermissionForm';

const WrappedRegistrationForm = Form.create()(PermissionForm);
class CreatePermission extends Component {
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
    return <ContentLayout contentForm={<WrappedRegistrationForm jumpFunction={this.props} />} />;
  }
}

export default CreatePermission;
