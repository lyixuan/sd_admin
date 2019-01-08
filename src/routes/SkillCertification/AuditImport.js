/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Button, Steps } from 'antd';
import { routerRedux } from 'dva/router';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';

const { Step } = Steps;
@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/getAuditList'],
}))
class AuditImport extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 返回
  handleBack = () => {
    this.props.dispatch(routerRedux.push('/skillCertification/auditList'));
  };

  render() {
    // const { loading } = this.props;
    return (
      <ContentLayout routerData={this.props.routerData}>
        <Spin spinning={false}>
          <div style={{ width: '720px', margin: 'auto' }}>
            <Steps progressDot current={1}>
              <Step title="选择Excel" />
              <Step title="校验文件" />
              <Step title="上传成功" />
            </Steps>
          </div>
          <Button
            onClick={this.handleBack}
            type="primary"
            style={{ float: 'right', marginBottom: 15 }}
            className={common.createButton}
          >
            提交
          </Button>
          <Button
            onClick={this.handleBack}
            type="primary"
            style={{ float: 'right', marginBottom: 15, marginRight: 5 }}
            className={common.resetButton}
          >
            返回
          </Button>
        </Spin>
      </ContentLayout>
    );
  }
}

export default AuditImport;
