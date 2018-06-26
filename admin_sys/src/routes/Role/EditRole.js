import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import StepLayout from '../../layouts/stepLayout';
import RoleForm from '../../selfComponent/RoleFrom/RoleForm';

const WrappedRoleForm = Form.create({
  mapPropsToFields(props) {
    const params = props.selfProps.getUrlParams();
    return {
      name: Form.createFormField({
        value: params.name,
      }),
    };
  },
})(RoleForm);
@connect(({ role, loading }) => ({
  role,
  loading,
}))
class EditRole extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'role/roleListAll',
      payload: { name: '' },
    });
  }
  submitInfo = values => {
    const params = this.props.getUrlParams();
    const paramsObj = {
      id: params.id,
      name: values.name,
      privilegeIds: values.privilegeIds || [1],
    };
    this.props.dispatch({
      type: 'role/roleUpdate',
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
        selfProps={this.props}
      />
    );
    return <StepLayout title="编辑角色" baseLayout={baseLayout} />;
  }
}

export default EditRole;
