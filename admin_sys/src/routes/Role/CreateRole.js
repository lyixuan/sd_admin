import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import RoleForm from '../../selfComponent/RoleFrom/RoleForm';

const WrappedRoleForm = Form.create()(RoleForm);
@connect(({ role, loading }) => ({
  role,
  loading: loading.effects['role/roleAdd'],
  rolePrivileges:loading.effects['role/roleListAll'],
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
    const { listAll = [] } = this.props.role;
    const baseLayout = (
      <WrappedRoleForm
        listAll={listAll}
        loading={this.props.loading}
        isShowFooter="true"
        selfProps={this.props}
        submitInfo={(values, privilegeIds) => {
          this.submitInfo(values, privilegeIds);
        }}
      />
    );
    return <ContentLayout routerData={this.props.routerData} contentForm={baseLayout} />;
  }
}

export default CreateRole;
