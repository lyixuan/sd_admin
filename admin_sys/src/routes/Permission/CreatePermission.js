import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import PermissionForm from '../../selfComponent/PermissionForm';

const WrappedRegistrationForm = Form.create()(PermissionForm);
@connect(({ permission, loading }) => ({
  permission,
  loading,
}))
class CreatePermission extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const permissionListAllNameParams = {};
    this.props.dispatch({
      type: 'permission/permissionListAllName',
      payload: { permissionListAllNameParams },
    });
  }
  render() {
    return !this.props.permission.permissionListAllName ? (
      []
    ) : !this.props.permission.permissionListAllName.data ? (
      <div />
    ) : (
      <ContentLayout contentForm={<WrappedRegistrationForm jumpFunction={this.props} />} />
    );
  }
}

export default CreatePermission;
