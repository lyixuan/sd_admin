import React, { Component } from 'react';
import { Form ,message} from 'antd';
import { connect } from 'dva';
import AccountForm from '../../selfComponent/AccountForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(AccountForm);
@connect(({ account, loading }) => ({
  account,
  loading,
}))
class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    const getRoleListParams = {};
    this.props.dispatch({
      type: 'account/getRoleList',
      payload: { getRoleListParams },
    });
  }
  handleSubmit = (values) => {
    console.log(values)
    const rname = values.rname[0];
    let newRoleId = 0;
    this.props.account.getRoleList.data.content.map(item => {
      if (item.name === rname) {
        newRoleId = item.id;
      }
      return 0;
    });
    const addAccountParams = {
      name: values.name,
      mail: `${values.mail}@sunlans.com`,
      roleId: newRoleId,
    };
    console.log(addAccountParams);
    this.props.dispatch({
      type: 'account/addAccount',
      payload: { addAccountParams },
    });
    message.success('账号创建成功！');
    this.props.setRouteUrlParams('/account/accountList', {});
  };

  render() {
    return !this.props.account.getRoleList ? (
      []
    ) : !this.props.account.getRoleList.data ? (
      <div />
    ) : (
      <ContentLayout contentForm={<WrappedRegistrationForm jumpFunction={this.props} handleSubmit={(values)=>{this.handleSubmit(values)}} />} />
    );
  }
}

export default CreateAccount;
