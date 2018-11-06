import React from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd';
import ContentLayout from '../../../layouts/ContentLayout';
import CoefficientForm from '../../../selfComponent/Coefficient/CoefficientForm';

const WrappedRoleForm = Form.create()(CoefficientForm);

@connect(({ coefficient, loading }) => ({
  coefficient,
  loading: loading.effects['coefficient/addPackage'],
}))
export default class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paramObj: {
        effectiveDate: '',
        expiryDate: '',
        id: null,
        packageType: 3,
        subMap: {
          6: [],
          7: [],
          8: [],
        },
      },
    };
  }
  submitFn = val => {
    const paramsObj = Object.assign(this.state.paramObj, val);
    if (paramsObj.subMap.effectiveDate) delete paramsObj.subMap.effectiveDate; // 移除无用属性
    this.props.dispatch({
      type: 'coefficient/addPackage',
      payload: paramsObj,
    });
  };
  render() {
    const { paramObj } = this.state;
    const baseLayout = (
      <WrappedRoleForm
        submitFn={val => this.submitFn(val)}
        paramObj={paramObj}
        loading={this.props.loading}
      />
    );
    return <ContentLayout routerData={this.props.routerData} contentForm={baseLayout} />;
  }
}
