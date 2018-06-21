import React, { Component } from 'react';
import { Form } from 'antd';
import AccountForm from '../../selfComponent/AccountForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(AccountForm);
class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  createUser = () => {
    this.props.setRouteUrlParams('/account/accountList', {
      a: 2,
      b: 3,
    });
  };
  render() {
    return <ContentLayout contentForm={<WrappedRegistrationForm jumpFunction={this.props} />} />;
  }
}

export default Form.create({ userName: 123 })(CreateAccount);
