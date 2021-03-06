import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import AddCaseForm from './Components/AddCaseForm';

const WrappedRegistrationForm = Form.create()(AddCaseForm);
@connect(({ excellent, loading }) => ({
  excellent,
  getInfoLoading: loading.effects['excellent/getPreInfo'],
}))
class AddExcellentCase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.getPreInfo();
  }
  componentWillUnmount() {
    this.saveFileList([]);
  }
  getPreInfo = () => {
    this.props.dispatch({
      type: 'excellent/getPreInfo',
      payload: {},
    });
  };

  saveFileList = fileList => {
    this.props.dispatch({
      type: 'excellent/saveFileList',
      payload: { fileList },
    });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/excellent/excellentCaseList');
  };

  render() {
    const { fileList } = this.props.excellent;
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
            saveFileList={param => {
              this.saveFileList(param);
            }}
            fileList={fileList}
          />
        }
      />
    );
  }
}

export default AddExcellentCase;
