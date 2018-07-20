import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import AccountForm from '../../selfComponent/AccountForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(AccountForm);
@connect(({ account, loading }) => ({
  account,
  submit: loading.effects['account/addAccount'],
}))
class CreateAccount extends Component {
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
  handleSubmit = values => {
    const rname = values.rname[0];
    let newRoleId = 0;
    const roleList = this.props.account.getRoleList.data;
    roleList.map(item => {
      if (item.name === rname) {
        newRoleId = item.id;
      }
      return 0;
    });
    const addAccountParams = {
      name: values.name.replace(/\s*/g, ''),
      mail: `${values.mail}@sunlands.com`,
      roleId: newRoleId,
    };
    this.props.dispatch({
      type: 'account/addAccount',
      payload: { addAccountParams },
    });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/config/accountList', {});
  };

  render() {
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <WrappedRegistrationForm
            jumpFunction={this.props}
            resetContent={() => {
              this.resetContent();
            }}
            handleSubmit={values => {
              this.handleSubmit(values);
            }}
          />
        }
      />
    );
  }
}

export default CreateAccount;
