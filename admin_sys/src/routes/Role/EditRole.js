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
  loading: loading.effects['role/roleUpdate'],
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
    console.log('-------');
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
    const { getRoleData = [], getRoleIds = [], privilegeId = [] } = this.props.role;
    const baseLayout = (
      <WrappedRoleForm
        checkdIds={privilegeId}
        listAll={getRoleData}
        loading={this.props.loading}
        isShowFooter="true"
        getRoleIds={getRoleIds}
        submitInfo={(values, privilegeIds) => {
          this.submitInfo(values, privilegeIds);
        }}
        selfProps={this.props}
      />
    );
    return <StepLayout routerData={this.props.routerData} baseLayout={baseLayout} />;
  }
}

export default EditRole;
