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
        this.props.account.getRoleList.data.content.map(item => {
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
        message.success('账号编辑成功！');
        this.props.setRouteUrlParams('/account/accountList', {});
  };

  render() {

    return !this.props.account.getRoleList ? (
      []
    ) : !this.props.account.getRoleList.data ? (
      <div />
    ) : (
      <ContentLayout contentForm={<WrappedRegistrationForm jumpFunction={this.props}  handleSubmit={(values)=>{this.handleSubmit(values)}} />} />
    );
  }
}

export default EditAccount;
