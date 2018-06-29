import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
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
class CheckRole extends Component {
  componentDidMount() {
    const params = this.props.getUrlParams();
    this.props.dispatch({
      type: 'role/roleListAll',
      payload: { name: '' },
    });
    const paramsIds = {
      id: params.id,
    };
    this.props.dispatch({
      type: 'role/rolePrivileges',
      payload: { paramsIds },
    });
  }

  render() {
    const listAll = !this.props.role.listAll ? [] : this.props.role.listAll;
    const getRoleIds = !this.props.role.getRoleIds ? [] : this.props.role.getRoleIds;

    const baseLayout = (
      <WrappedRoleForm listAll={listAll} getRoleIds={getRoleIds} selfProps={this.props} />
    );
    return <StepLayout title="查看角色" baseLayout={baseLayout} />;
  }
}

export default CheckRole;
