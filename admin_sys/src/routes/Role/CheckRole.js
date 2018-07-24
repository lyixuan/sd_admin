import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
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
  rolePrivileges:loading.effects['role/rolePrivileges'],
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
    const { getRoleData = [], getRoleIds = [], privilegeIds = [] } = this.props.role;
    const baseLayout = (
      <WrappedRoleForm
        checkdIds={privilegeIds}
        listAll={getRoleData}
        getRoleIds={getRoleIds}
        selfProps={this.props}
      />
    );
    return <ContentLayout routerData={this.props.routerData} contentForm={baseLayout} />;
  }
}

export default CheckRole;
