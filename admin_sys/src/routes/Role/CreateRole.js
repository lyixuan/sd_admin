import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import StepLayout from '../../layouts/stepLayout';
import RoleForm from '../../selfComponent/RoleFrom/RoleForm';

const WrappedRoleForm = Form.create()(RoleForm);
@connect(({ role, loading }) => ({
  role,
  loading,
}))
class CreateRole extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'role/roleListAll',
      payload: { name: '' },
    });
  }
  render() {
    const listAll = !this.props.role.listAll ? [] : this.props.role.listAll.content;
    const baseLayout = <WrappedRoleForm listAll={listAll} />;
    return <StepLayout title="创建角色" baseLayout={baseLayout} />;
  }
}

export default CreateRole;
