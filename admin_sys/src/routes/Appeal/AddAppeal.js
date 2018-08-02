import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import AppealForm from '../../selfComponent/AppealForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(AppealForm);
@connect(({ appeal, loading }) => ({
  appeal,
  submit: loading.effects['appeal/addAppeal'],
}))
class AddAppeal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {

  }
  handleSubmit = values => {
    console.log(values)
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/appeal/appealList', {});
  };

  render() {
    return (
      <ContentLayout
        routerData
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

export default AddAppeal;
