/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment/moment';
import ContentLayout from '../../layouts/ContentLayout';
import downloadimg from '../../assets/download.svg';
import DownLoad from '../../components/downLoad';

@connect(({ excellent, loading }) => ({
  excellent,
  loading: loading.effects['excellent/excellentCaseApplyDetail'],
}))
class AuditDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    const params = this.props.getUrlParams();
    this.props.dispatch({
      type: 'excellent/excellentCaseApplyDetail',
      payload: { params },
    });
  }

  renderText = () => {
    return <img src={downloadimg} alt="下载" />;
  };

  render() {
    const { loading } = this.props;
    const { detailInfo } = this.props.excellent;

    function getFileName() {
      return `${detailInfo.certificationItemName}-${detailInfo.userName}-${moment(
        detailInfo.applyTime
      ).format('MMDDHHmmss')}`;
    }

    function getFileType() {
      const arr = attachmentUrl.splice('.');
      return arr[arr.length - 1];
    }

    const mystyle = {
      width: '30px',
      float: 'left',
      marginLeft: '20px',
    };

    const linestyle = {
      background: '#FFF4E7',
      height: '43px',
      paddingLeft: '18px',
      fontSize: '16px',
      color: '#FD9929',
      lineHeight: '43px',
      fontWeight: 500,
    };

    const textstyle = {
      margin: '26px 18px',
      background: '#F6F7FA',
      borderRadius: '4px',
      overflow: 'hidden',
      padding: '32px 28px',
    };

    return (
      <ContentLayout routerData={this.props.routerData}>
        <Spin spinning={loading}>
          <div style={linestyle}>基本信息</div>
          <div style={{ margin: '26px 0 0 18px', color: '#000', overflow: 'hidden' }}>
            <span style={{ width: '100%', float: 'left' }}>
              申&nbsp;&nbsp;请&nbsp;&nbsp;人：
              <span style={{ marginRight: '10px' }}>{detailInfo.userName}</span>{' '}
              <span style={{ marginRight: '10px' }}>{detailInfo.userType}</span>{' '}
              <span style={{ marginRight: '10px' }}>{detailInfo.orgName}</span>
            </span>
          </div>
          <div style={{ margin: '22px 0 26px 18px', color: '#000' }}>
            <span style={{ width: 540, float: 'left' }}>
              认证项目：{detailInfo.certificationItemName}
            </span>
            <span>提交时间：{detailInfo.applyTime}</span>
          </div>
          <div style={linestyle}>认证详情</div>
          <div style={{ margin: '26px 18px', color: '#000', overflow: 'hidden' }}>
            <span style={{ width: 540, float: 'left', cursor: 'pointer' }}>
              <span style={{ float: 'left' }}>
                附件：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{getFileName}
                {getFileType}
              </span>
              <DownLoad
                mystyle={mystyle}
                loadUrl={detailInfo.attachmentUrl}
                fileName={getFileName}
                text={this.renderText()}
              />
            </span>
          </div>
          <div style={textstyle}>{detailInfo.detail ? detailInfo.detail : '暂无内容'}</div>
        </Spin>
      </ContentLayout>
    );
  }
}

export default AuditDetail;
