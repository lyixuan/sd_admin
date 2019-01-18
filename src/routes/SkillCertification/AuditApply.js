/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Button, Radio, Input, Divider, message } from 'antd';
import moment from 'moment/moment';
import { routerRedux } from 'dva/router';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/getSignExamineInfo'],
}))
class AuditApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      rejectReason: '',
    };
    this.signExamineList = [];
  }

  UNSAFE_componentWillMount() {
    const params = this.props.getUrlParams();
    this.props.dispatch({
      type: 'audit/getSignExamineInfo',
      payload: { params },
    });
  }

  onChange = (e, i) => {
    this.signExamineList[i].signResult = e.target.value;
    this.setState({
      value: e.target.value,
    });
    if (e.target.value === 1) {
      this.signExamineList[i].rejectReason = '';
    }
    console.log(this.state.value);
  };

  onReasonChange = (e, i) => {
    this.signExamineList[i].rejectReason = e.target.value;
    this.setState({
      value: e.target.rejectReason,
    });
    console.log(this.state.rejectReason);
  };

  handleBack = () => {
    this.props.dispatch(routerRedux.push('/skillCertification/auditList'));
  };

  handleSubmit = () => {
    const params = { checkResultList: [] };
    let flag = 0;
    this.signExamineList.forEach(v => {
      if (!v.signResult) {
        message.warn('请选择审核结果');
        flag = 1;
      }
      if (v.signResult === 2 && !v.rejectReason) {
        message.warn('请填写驳回原因');
        flag = 1;
      }
      if (v.rejectReason && v.rejectReason.length > 50) {
        message.warn('驳回原因字数超限');
        flag = 1;
      }
      params.checkResultList.push({
        certificationDetailInfoId: v.certificationDetailInfoId,
        rejectReason: v.rejectReason,
        result: v.signResult,
      });
    });
    if (flag) {
      return;
    }
    this.props.dispatch({
      type: 'audit/submitSignResult',
      payload: { params },
    });
  };

  render() {
    const { loading } = this.props;
    const { signExamineInfo, signExamineList, applySubmitting } = this.props.audit;
    this.signExamineList = signExamineList;
    const item = this.signExamineList.map((v, i) => (
      <div key={v.certificationDetailInfoId}>
        <div style={{ margin: '25px 0 20px 18px', color: '#000' }}>
          <span>认证项目：{v.certificationName}</span>
        </div>
        {v.subItemName ? (
          <div style={{ margin: '25px 0 20px 18px', color: '#000' }}>
            <span>负责专业项目：{v.subItemName}</span>
          </div>
        ) : null}
        <div style={{ margin: '0 0 20px 18px', color: '#000' }}>
          <span>
            报名审核：
            <RadioGroup
              onChange={e => this.onChange(e, i)}
              value={this.signExamineList[i].signResult}
            >
              <Radio value={1}>通过</Radio>
              <Radio value={2}>驳回</Radio>
            </RadioGroup>
          </span>
        </div>
        {v.signResult === 2 ? (
          <div style={{ margin: '0 0 25px 18px', color: '#000', overflow: 'hidden' }}>
            <span>
              <span style={{ float: 'left' }}>驳回原因：</span>
              <span style={{ float: 'left', width: 'calc(100% - 70px)' }}>
                <TextArea
                  onChange={e => this.onReasonChange(e, i)}
                  value={this.signExamineList[i].rejectReason}
                  placeholder="请填写驳回原因，限制50字内。"
                  autosize={{ minRows: 3, maxRows: 3 }}
                />
              </span>
            </span>
          </div>
        ) : null}
        <Divider />
      </div>
    ));
    return (
      <ContentLayout routerData={this.props.routerData}>
        <Spin spinning={loading}>
          <div
            style={{
              background: '#F6F7FA',
              height: '43px',
              paddingLeft: '18px',
              fontSize: '16px',
              color: '#353535',
              lineHeight: '43px',
              fontWeight: 500,
            }}
          >
            基本信息
          </div>
          <div style={{ margin: '36px 0 0 18px', color: '#000' }}>
            <span style={{ width: 540, float: 'left' }}>
              姓&nbsp;&nbsp;&nbsp;&nbsp;名：{signExamineInfo.name}
            </span>
            <span>
              组 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;织：{signExamineInfo.orgName
                ? `${signExamineInfo.orgName.collegeName} | ${
                    signExamineInfo.orgName.familyName
                  } | ${signExamineInfo.orgName.groupName}`
                : ''}
            </span>
          </div>
          <div style={{ margin: '26px 0 36px 18px', color: '#000' }}>
            <span style={{ width: 540, float: 'left' }}>归属地：{signExamineInfo.city}</span>
            <span>报名日期：{moment(signExamineInfo.signDate).format('YYYY-MM-DD HH:mm:ss')}</span>
          </div>
          <div
            style={{
              background: '#F6F7FA',
              height: '43px',
              paddingLeft: '18px',
              fontSize: '16px',
              color: '#353535',
              lineHeight: '43px',
              fontWeight: 500,
            }}
          >
            认证项目
          </div>
          {item}
          <Button
            onClick={this.handleSubmit}
            type="primary"
            style={{ float: 'right', marginBottom: 15 }}
            className={common.createButton}
            loading={applySubmitting}
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

export default AuditApply;
