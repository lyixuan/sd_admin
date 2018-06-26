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
class CheckRole extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'role/roleListAll',
      payload: { name: '' },
    });
  }
  render() {
    const listAll = !this.props.role.listAll ? [] : this.props.role.listAll;
    const baseLayout = (
      <WrappedRoleForm
        listAll={listAll}
        submitInfo={values => {
          this.submitInfo(values);
        }}
      />
    );
    return <StepLayout title="查看角色" baseLayout={baseLayout} />;
  }
}

export default CheckRole;
