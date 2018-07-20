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
      payload: {},
    });
  }
  submitInfo = (values, privilegeIds) => {
    const paramsObj = {
      name: !values.name ? undefined : values.name.replace(/\s*/g, ''),
      privilegeIds,
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
        isShowFooter="true"
        submitInfo={(values, privilegeIds) => {
          this.submitInfo(values, privilegeIds);
        }}
      />
    );
    return <StepLayout title="创建角色" baseLayout={baseLayout} />;
  }
}

export default CreateRole;
