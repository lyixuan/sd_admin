import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import CertificationEdit_Form from './component/CertificationEdit_Form.js';
import ContentLayout from '../../layouts/ContentLayout';
import CertificationEdit_Table from './component/CertificationEdit_Table.js';

const WrappedRegistrationForm = Form.create()(CertificationEdit_Form);
@connect(({ user, loading }) => ({
  user,
  submit: loading.effects['user/userAdd'],
}))
class CertificationEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }

  // 点击确定按钮请求接口
  handleSubmit = (values) => {
    console.log(values)
  };
  // 点击取消按钮跳转到list页面
  resetContent = () => {
    window.history.go(-1);
  };

  render() {
    return (
      <>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={
            <WrappedRegistrationForm
              jumpFunction={this.props}
              resetContent={() => {
                this.resetContent();
              }}
              handleSubmit={(values, dataString) => {
                this.handleSubmit(values, dataString);
              }}
            />
          }
        />
        <CertificationEdit_Table dataSource={{a:1,b:2}} />
      </>
    );
  }
}

export default CertificationEdit;
