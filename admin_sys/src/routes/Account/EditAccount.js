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
    const arrValue = this.props.getUrlParams();
    this.state = {
      id: !arrValue.id ? '' : arrValue.id,
    };
  }
  componentDidMount() {
    const getRoleListParams = {};
    this.props.dispatch({
      type: 'account/getRoleList',
      payload: { getRoleListParams },
    });

    const accountInfoParams = {id:this.state.id};
    this.props.dispatch({
      type: 'account/accountInfo',
      payload: { accountInfoParams },
    });
  }

  handleSubmit = (values) => {
        const rname = values.rname[0];
        let newRoleId = 0;
        const roleList = this.props.account.getRoleList.data
        roleList.map(item => {
          if (item.name === rname) {
            newRoleId = item.id;
          }
          return 0;
        });
        const updateAccountParams = {
            name: values.name,
            mail: `${values.mail}@sunlands.com`,
            roleId: newRoleId,
            id: Number(this.state.id),
        };
        this.props.dispatch({
            type: 'account/updateAccount',
            payload: { updateAccountParams },
        });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/account/accountList', {});
  };

  render() {
    return (
      <ContentLayout
        contentForm={
          <WrappedRegistrationForm
            jumpFunction={this.props}
            resetContent={()=>{this.resetContent()}}
            handleSubmit={(values)=>{this.handleSubmit(values)}}
          />}
      />
    );
  }
}

export default EditAccount;
