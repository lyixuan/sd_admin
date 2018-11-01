import React from 'react';
import { Form } from 'antd';
import ContentLayout from '../../../layouts/ContentLayout';
import CoefficientForm from '../../../selfComponent/Coefficient/CoefficientForm';

const WrappedRoleForm = Form.create()(CoefficientForm);
// @connect(({ role, loading }) => ({
//   role,
//   loading: loading.effects['role/roleAdd'],
//   rolePrivileges: loading.effects['role/roleListAll'],
// }))
export default class Create extends React.Component {
  render() {
    const baseLayout = <WrappedRoleForm />;
    return <ContentLayout routerData={this.props.routerData} contentForm={baseLayout} />;
  }
}
