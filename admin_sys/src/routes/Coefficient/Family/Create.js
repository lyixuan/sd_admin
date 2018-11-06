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
      effectiveDate: '',
      expiryDate: '',
      id: null,
      packageType: 2,
      subMap: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
      },
    };
  }
  submitFn = val => {
    const paramsObj = Object.assign(this.state, val);
    if (paramsObj.subMap.effectiveDate) delete paramsObj.subMap.effectiveDate; // 移除无用属性
    this.props.dispatch({
      type: 'coefficient/addPackage',
      payload: paramsObj,
    });
  };
  checkPrice = (rule, value = {}) => {
    const list = Array.isArray(value.list) ? value.list : [];
    list.forEach(item => {
      if (!item.beginVal) {
        console.log('填写不完整');
        // return;
      }
    });
  };

  render() {
    const { subMap } = this.state;
    const baseLayout = <WrappedRoleForm submitFn={val => this.submitFn(val)} subMap={subMap} />;
    return <ContentLayout routerData={this.props.routerData} contentForm={baseLayout} />;
  }
}
