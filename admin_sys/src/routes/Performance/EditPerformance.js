import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import PerformanceForm from '../../selfComponent/Performance/PerformanceForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(PerformanceForm);
@connect(({ performance, loading }) => ({
  performance,
  loading,
}))
class EditPerformance extends Component {
  constructor(props) {
    super(props);
    // const arrValue = this.props.getUrlParams();
    this.state = {
      // id: !arrValue.id ? '' : arrValue.id,
    };
  }
  componentDidMount() {
    // 根据id获取数据datasource
  }

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
