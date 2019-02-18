import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import AddCaseForm from './Components/AddCaseForm';

const WrappedRegistrationForm = Form.create()(AddCaseForm);
@connect(({ excellent, loading }) => ({
  excellent,
  loading,
}))
class AddExcellentCase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.getPreInfo();
  }
  getPreInfo = () => {
    this.props.dispatch({
      type: 'excellent/getPreInfo',
      payload: {},
    });
  };
  handleSubmit = val => {
    console.log(val);
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/excellent/excellentCaseList');
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
