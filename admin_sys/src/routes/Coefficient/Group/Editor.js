import React from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd';
import { formatDateNew } from '../../../utils/FormatDate';
import { showPercentFn } from '../component/showPercentFn';
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
    let paramsObj = {};

    const newVal = JSON.parse(JSON.stringify(val));
    if (!val.effectiveDate) {
      paramsObj = {
        ...this.state.paramObj,
        ...newVal,
        ...{
          id: data.id,
          effectiveDate: formatDateNew(data.effectiveDate),
          expiryDate: formatDateNew(data.expiryDate),
        },
      };
    } else {
      paramsObj = { ...this.state.paramObj, ...newVal, ...{ id: data.id } };
    }

    if (paramsObj.subMap.effectiveDate) delete paramsObj.subMap.effectiveDate; // 移除无用属性

    // 上传的百分比参数需要小数
    showPercentFn(paramsObj.subMap, 3, '/');

    this.props.dispatch({
      type: 'coefficient/updatePackage',
      payload: paramsObj,
    });
  };
  render() {
    const { data = {} } = this.props.coefficient;
    const { subMap = {} } = data;

    // 回显时百分比展示整数
    if (Object.keys(subMap).length !== 0) {
      showPercentFn(subMap, 3, '*');
      // Object.keys(subMap).map(item => {
      //   const res = subMap[item];
      //   res.forEach((val, i) => {
      //     res[i].levelLowerLimit = val.levelLowerLimit * 100;
      //     res[i].levelUpperLimit = val.levelUpperLimit * 100;
      //     res[i].classKpi = val.classKpi * 100;
      //     res[i].groupKpi = val.groupKpi * 100;
      //   });
      //   return res;
      // });
    }

    const baseLayout = (
      <WrappedRoleForm
        submitFn={val => this.submitFn(val)}
        paramObj={data}
        loading={this.props.submitLoading}
        infoLoading={this.props.loading}
      />
    );
    return <ContentLayout routerData={this.props.routerData} contentForm={baseLayout} />;
  }
}
