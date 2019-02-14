/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
// import moment from 'moment/moment';
import { routerRedux } from 'dva/router';
import ContentLayout from '../../layouts/ContentLayout';

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/getSignExamineInfo'],
}))
class AuditApply extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // UNSAFE_componentWillMount() {
  // const params = this.props.getUrlParams();
  // this.props.dispatch({
  //   type: 'audit/getSignExamineInfo',
  //   payload: { params },
  // });
  // }

  handleBack = () => {
    this.props.dispatch(routerRedux.push('/skillCertification/auditList'));
  };

  render() {
    // const { loading } = this.props;
    // const { signExamineInfo } = this.props.audit;
    return (
      <ContentLayout routerData={this.props.routerData}>
        <Spin spinning={false}>
          <div
            style={{
              background: '#FFF4E7',
              height: '43px',
              paddingLeft: '18px',
              fontSize: '16px',
              color: '#FD9929',
              lineHeight: '43px',
              fontWeight: 500,
            }}
          >
            基本信息
          </div>
          <div style={{ margin: '26px 0 0 18px', color: '#000', overflow: 'hidden' }}>
            <span style={{ width: '100%', float: 'left' }}>
              申&nbsp;&nbsp;请&nbsp;&nbsp;人：刘样 班主任 知识学院 | 能源管理 | 运营1组
            </span>
          </div>
          <div style={{ margin: '22px 0 26px 18px', color: '#000' }}>
            <span style={{ width: 540, float: 'left' }}>认证项目：方法论高手</span>
            <span>提交时间：2018-01-01 09：09：09</span>
          </div>
          <div
            style={{
              background: '#FFF4E7',
              height: '43px',
              paddingLeft: '18px',
              fontSize: '16px',
              color: '#FD9929',
              lineHeight: '43px',
              fontWeight: 500,
            }}
          >
            认证详情
          </div>
          <div style={{ margin: '26px 18px', color: '#000', overflow: 'hidden' }}>
            <span style={{ width: 540, float: 'left' }}>
              附件：方法论高手案例-甘文斌-090091.zip
            </span>
          </div>
          <div
            style={{
              margin: '26px 18px',
              background: '#F6F7FA',
              borderRadius: '4px',
              overflow: 'hidden',
              padding: '32px 28px',
            }}
          >
            <span>dsljlasd</span>
            <span>dsljlasd</span>
            <p>还是打好了撒胡老师的连锁店</p>
            <p>还是打好了撒胡老师的连锁店</p>
            <p>还是打好了撒胡老师的连锁店</p>
            <p>还是打好了撒胡老师的连锁店</p>
          </div>
        </Spin>
      </ContentLayout>
    );
  }
}

export default AuditApply;
