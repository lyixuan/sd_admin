import React from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd';
import ContentLayout from '../../../layouts/ContentLayout';
import CoefficientForm from '../../../selfComponent/Coefficient/CoefficientForm';

const WrappedRoleForm = Form.create()(CoefficientForm);

@connect(({ coefficient, loading }) => ({
  coefficient,
  loading: loading.effects['coefficient/packageInfo'],
  submitLoading: loading.effects['coefficient/updatePackage'],
}))
export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    const params = this.props.getUrlParams();
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
      params,
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    const userListParams = this.state.params;
    this.props.dispatch({
      type: 'coefficient/packageInfo',
      payload: { userListParams },
    });
  };
  submitFn = val => {
    const { data = {} } = this.props.coefficient;
    const paramsObj = Object.assign(this.state.paramObj, val, { id: data.id });
    if (paramsObj.subMap.effectiveDate) delete paramsObj.subMap.effectiveDate; // 移除无用属性
    this.props.dispatch({
      type: 'coefficient/updatePackage',
      payload: paramsObj,
    });
  };
  render() {
    const { data } = this.props.coefficient;

    const baseLayout = (
      <WrappedRoleForm
        submitFn={val => this.submitFn(val)}
        paramObj={data}
        loading={this.props.submitLoading}
      />
    );
    return <ContentLayout routerData={this.props.routerData} contentForm={baseLayout} />;
  }
}
