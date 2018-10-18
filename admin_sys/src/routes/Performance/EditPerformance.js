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
}))
class EditPerformance extends Component {
  componentDidMount() {
    const { id, collegeId } = this.props.getUrlParams();
    console.log(id, collegeId);
    // 根据id获取数据datasource
  }
  // getUserData = params => {};

  handleSubmit = values => {
    console.log(values);
    // 提交时请求接口
  };

  resetContent = () => {
    window.history.go(-1);
  };

  render() {
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
