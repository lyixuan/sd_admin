import React, { Component } from 'react';
import { Form } from 'antd';
import StepLayout from '../../layouts/stepLayout';
import RoleForm from '../../selfComponent/RoleFrom/RoleForm';

const WrappedRoleForm = Form.create()(RoleForm);
class EditRole extends Component {
  render() {
    const baseLayout = <WrappedRoleForm />;
    return <StepLayout title="编辑角色" baseLayout={baseLayout} />;
  }
}

export default EditRole;
