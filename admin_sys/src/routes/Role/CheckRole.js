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
    const paramsIds = {
      id: params.id,
    };
    this.props.dispatch({
      type: 'role/rolePrivileges',
      payload: { paramsIds },
    });
  }

  render() {
    const { getRoleData = [], getRoleIds = [] } = this.props.role;
    const baseLayout = (
      <WrappedRoleForm listAll={getRoleData} getRoleIds={getRoleIds} selfProps={this.props} />
    );
    return <StepLayout routerData={this.props.routerData} baseLayout={baseLayout} />;
  }
}

export default CheckRole;
