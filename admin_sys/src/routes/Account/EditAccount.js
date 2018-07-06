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

  }

  handleSubmit = (values) => {
        console.log(values)
        const rname = values.rname[0];
        let newRoleId = 0;
        const roleList = this.props.account.getRoleList.data.content
        roleList.map(item => {
          if (item.name === rname) {
            newRoleId = item.id;
          }
          return 0;
        });
        const updateAccountParams = {
            name: values.name,
            mail: `${values.mail}@sunlans.com`,
            roleId: newRoleId,
            id: Number(this.state.id),
        };
        console.log(updateAccountParams);
        this.props.dispatch({
            type: 'account/updateAccount',
            payload: { updateAccountParams },
        });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/account/accountList', {});
  };

  render() {
    console.log(this.props.account.getRoleList)
    return (!this.props.account.getRoleList ? [] : !this.props.account.getRoleList.data ? <div /> :
      (
        <ContentLayout
          contentForm={<WrappedRegistrationForm
            jumpFunction={this.props}
            resetContent={()=>{this.resetContent()}}
            handleSubmit={(values)=>{this.handleSubmit(values)}}
          />}
        />
      )
    );
  }
}

export default EditAccount;
