/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Button, Radio, Input, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/getAuditList'],
}))
class AuditApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  // 返回
  handleBack = () => {
    this.props.dispatch(routerRedux.push('/skillCertification/auditList'));
  };

  render() {
    // const { loading } = this.props;
    return (
      <ContentLayout routerData={this.props.routerData}>
        <Spin spinning={false}>
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
            <span style={{ width: 540, float: 'left' }}>姓&nbsp;&nbsp;&nbsp;&nbsp;名：刘样</span>
            <span>
              组 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;织：自变量学院|汉语言文学本科2|汉语言文学
            </span>
          </div>
          <div style={{ margin: '26px 0 36px 18px', color: '#000' }}>
            <span style={{ width: 540, float: 'left' }}>归属地：刘样</span>
            <span>报名日期：2018-09-09 12:11:11</span>
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
          <div>
            <div style={{ margin: '25px 0 20px 18px', color: '#000' }}>
              <span>认证项目：IM认证</span>
            </div>
            <div style={{ margin: '25px 0 20px 18px', color: '#000' }}>
              <span>负责专业项目：全国工商企业管理</span>
            </div>
            <div style={{ margin: '0 0 20px 18px', color: '#000' }}>
              <span>
                报名审核：
                <RadioGroup onChange={this.onChange} value={this.state.value}>
                  <Radio value={1}>通过</Radio>
                  <Radio value={2}>驳回</Radio>
                  <Radio value={0} style={{ visibility: 'hidden' }}>
                    &nbsp;
                  </Radio>
                </RadioGroup>
              </span>
            </div>
            <div style={{ margin: '0 0 25px 18px', color: '#000', overflow: 'hidden' }}>
              <span>
                <span style={{ float: 'left' }}>驳回原因：</span>
                <span style={{ float: 'left', width: 'calc(100% - 70px)' }}>
                  <TextArea placeholder="请填写驳回原因" autosize={{ minRows: 3, maxRows: 3 }} />
                </span>
              </span>
            </div>
          </div>
          <div>
            <Divider />
            <div style={{ margin: '25px 0 20px 18px', color: '#000' }}>
              <span>认证项目：IM认证</span>
            </div>
            <div style={{ margin: '0 0 20px 18px', color: '#000' }}>
              <span>
                报名审核：
                <RadioGroup onChange={this.onChange} value={this.state.value}>
                  <Radio value={1}>通过</Radio>
                  <Radio value={2}>驳回</Radio>
                  <Radio value={0} style={{ visibility: 'hidden' }}>
                    &nbsp;
                  </Radio>
                </RadioGroup>
              </span>
            </div>
            <div style={{ margin: '0 0 25px 18px', color: '#000', overflow: 'hidden' }}>
              <span>
                <span style={{ float: 'left' }}>驳回原因：</span>
                <span style={{ float: 'left', width: 'calc(100% - 70px)' }}>
                  <TextArea placeholder="请填写驳回原因" autosize={{ minRows: 3, maxRows: 3 }} />
                </span>
              </span>
            </div>
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

export default AuditApply;
