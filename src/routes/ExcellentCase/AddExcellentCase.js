import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import PermissionForm from '../../selfComponent/PermissionForm';

const WrappedRegistrationForm = Form.create()(PermissionForm);
@connect(({ excellent, loading }) => ({
  excellent,
  loading: false,
  submit: loading.effects['excellent/addPermission'],
  permissionListAllName: loading.effects['excellent/permissionListAllName'],
}))
class AddExcellentCase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = val => {
    console.log(val);
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/excellent/excellentCase');
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

export default AddExcellentCase;
