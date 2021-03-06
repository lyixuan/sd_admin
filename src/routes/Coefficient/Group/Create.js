import React from 'react';
import { connect } from 'dva/index';
import { Form, message } from 'antd';
import ContentLayout from '../../../layouts/ContentLayout';
import CoefficientForm from '../../../selfComponent/Coefficient/CoefficientForm';
import { showPercentFn } from '../component/showPercentFn';

const WrappedRoleForm = Form.create()(CoefficientForm);

@connect(({ coefficient, loading }) => ({
  coefficient,
  loading: loading.effects['coefficient/addPackage'],
}))
export default class Create extends React.Component {
  constructor(props) {
    super(props);

    this.isRequest = true;
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
  alertErr = () => {
    this.isRequest = false;
    message.error('请完善所有信息');
  };
  submitFn = val => {
    const newVal = JSON.parse(JSON.stringify(val));
    this.isRequest = true;
    const paramsObj = Object.assign(this.state.paramObj, newVal);
    if (paramsObj.subMap.effectiveDate) delete paramsObj.subMap.effectiveDate; // 移除无用属性

    // 上传的百分比参数需要小数
    showPercentFn(paramsObj.subMap, '/', this.alertErr);
    if (this.isRequest) {
      this.props.dispatch({
        type: 'coefficient/addPackage',
        payload: paramsObj,
      });
    }
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
