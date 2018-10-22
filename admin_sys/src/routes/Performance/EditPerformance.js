import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import PerformanceForm from '../../selfComponent/Performance/PerformanceForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(PerformanceForm);
@connect(({ performance, loading }) => ({
  performance,
  loading,
  submitLoading: loading.effects['performance/updateActualKpi'],
  actualKpiInfo: performance.actualKpiInfo,
}))
class EditPerformance extends Component {
  componentDidMount() {
    const { userId, collegeId } = this.props.getUrlParams();
    this.getUserData({ userId, collegeId });
  }
  getUserData = (payload = {}) => {
    this.props.dispatch({
      type: 'performance/findActualKpiInfo',
      payload,
    });
  };

  handleSubmit = payload => {
    this.props.dispatch({
      type: 'performance/updateActualKpi',
      payload,
    });
  };

  resetContent = () => {
    window.history.go(-1);
  };

  render() {
    const actualKpiInfo = this.props.actualKpiInfo || {};
    const dataSource = [];
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <WrappedRegistrationForm
            jumpFunction={this.props}
            resetContent={() => {
              this.resetContent();
            }}
            actualKpiInfo={actualKpiInfo}
            dataSource={dataSource}
            handleSubmit={values => {
              this.handleSubmit(values);
            }}
          />
        }
      />
    );
  }
}

export default EditPerformance;
