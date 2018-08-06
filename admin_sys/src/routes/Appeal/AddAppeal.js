import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import AppealForm from '../../selfComponent/AppealForm.js';
import ContentLayout from '../../layouts/ContentLayout';
import { appealType } from '../../utils/dataDictionary';
import { getAuthority } from '../../utils/authority';

const WrappedRegistrationForm = Form.create()(AppealForm);
@connect(({ appeal, loading }) => ({
  appeal,
  loading: false,
  submit: loading.effects['appeal/addAppeal'],
}))
class AddAppeal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  handleSubmit = values => {
    const {
      type = null,
      consultId = null,
      countBeginTime = null,
      ordId = null,
      stuId = null,
      workorderId = null,
    } = values;
    const newWorkorderId = type.substr(0, 2) === '工单' ? workorderId : null;
    const newConsultId = type.substr(0, 2) === 'IM' ? consultId : null;
    const localStorage = getAuthority('admin_user');
    const operator = !localStorage ? null : localStorage.userId;
    const addAppealParams = {
      type: !type ? null : appealType[type],
      consultId: !newConsultId ? null : Number(newConsultId),
      countTime: !countBeginTime ? null : `${countBeginTime} 00:00:00`,
      ordId: !ordId ? null : Number(ordId),
      stuId: !stuId ? null : Number(stuId),
      workorderId: !newWorkorderId ? null : Number(newWorkorderId),
      operator,
    };
    const appealListParams = {
      pageSize: 30,
      pageNum: 0,
    };
    this.props.dispatch({
      type: 'appeal/addAppeal',
      payload: { addAppealParams, appealListParams },
    });
  };

  resetContent = () => {
    this.props.setCurrentUrlParams({});
    this.props.setRouteUrlParams('/appeal/appealList', {});
  };

  render() {
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <WrappedRegistrationForm
            jumpFunction={this.props}
            show={1}
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
