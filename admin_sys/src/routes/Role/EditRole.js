import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
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
  loading: loading.effects['role/roleUpdate'],
  rolePrivileges: loading.effects['role/rolePrivileges'],
}))
class EditRole extends Component {
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

  submitInfo = (values, privilegeIds) => {
    const params = this.props.getUrlParams();
    const paramsObj = {
      id: params.id,
      name: values.name.replace(/\s*/g, ''),
      privilegeIds,
    };
    this.props.dispatch({
      type: 'role/roleUpdate',
      payload: { paramsObj },
    });
  };
  render() {
    const { getRoleData = [], getRoleIds = [], privilegeIds = [] } = this.props.role;
    const baseLayout = (
      <WrappedRoleForm
        checkdIds={privilegeIds}
        listAll={getRoleData}
        loading={this.props.loading}
        isShowFooter="true"
        getRoleIds={getRoleIds}
        submitInfo={(values, privilegeId) => {
          this.submitInfo(values, privilegeId);
        }}
        selfProps={this.props}
      />
    );

    return <ContentLayout routerData={this.props.routerData} contentForm={baseLayout} />;
  }
}

export default EditRole;
