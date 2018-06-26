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
  submitInfo = values => {
    const paramsObj = {
      name: values.name,
      privilegeIds: values.privilegeIds || [1],
    };
    this.props.dispatch({
      type: 'role/roleAdd',
      payload: { paramsObj },
    });
  };
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
    return <StepLayout title="创建角色" baseLayout={baseLayout} />;
  }
}

export default CreateRole;
