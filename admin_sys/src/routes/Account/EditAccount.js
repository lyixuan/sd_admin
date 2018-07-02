import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import AccountForm from '../../selfComponent/AccountForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(AccountForm);
@connect(({ account, loading }) => ({
  account,
  loading,
}))
class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const getRoleListParams = {};
    this.props.dispatch({
      type: 'account/getRoleList',
      payload: { getRoleListParams },
    });
  }
  render() {
    return !this.props.account.getRoleList ? (
      []
    ) : !this.props.account.getRoleList.data ? (
      <div />
    ) : (
      <ContentLayout contentForm={<WrappedRegistrationForm jumpFunction={this.props} />} />
    );
  }
}

export default EditAccount;
