/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, message } from 'antd';
import moment from 'moment/moment';
import ContentLayout from '../../layouts/ContentLayout';
import downloadimg from '../../assets/download.svg';
import downloadimg_disabled from '../../assets/download_disabled.svg';
import DownLoad from '../../components/downLoad';
import common from './Components/common.less';

@connect(({ excellent, loading }) => ({
  excellent,
  loading: loading.effects['excellent/excellentCaseApplyDetail'],
}))
class AuditDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressTextBtnAllow: true,
    };
  }

  UNSAFE_componentWillMount() {
    const params = this.props.getUrlParams();
    this.props.dispatch({
      type: 'excellent/excellentCaseApplyDetail',
      payload: { params },
    });
  }

  onError = status => {
    if (status !== 200) {
      message.error('下载出错');
    }
  };

  onChange = states => {
    if (states === 'loaded') {
      this.setState({
        progressTextBtnAllow: true,
      });
    } else if (states === 'loading') {
      this.setState({
        progressTextBtnAllow: false,
      });
    }
  };

  renderText = () => {
    return this.state.progressTextBtnAllow ? (
      <img src={downloadimg} alt="下载" />
    ) : (
      <img src={downloadimg_disabled} alt="下载" />
    );
  };

  render() {
    const { loading } = this.props;
    const { detailInfo } = this.props.excellent;

    const applyUser = (
      <span>
        <span style={{ marginRight: '10px' }}>{detailInfo.userName}</span>
        <span style={{ marginRight: '10px' }}>
          {window.BI_Filter(`Certification_ONLYUSER|id:${detailInfo.userType}`).name}
        </span>
        <span style={{ marginRight: '10px' }}>{detailInfo.orgName}</span>
      </span>
    );

    function getFileName() {
      return `${detailInfo.certificationItemName}-${detailInfo.userName}-${moment(
        detailInfo.applyTime
      ).format('MMDDHHmmss')}`;
    }

    function getFileType() {
      let result = '';
      if (detailInfo.attachmentUrl) {
        const arr = detailInfo.attachmentUrl.split('.');
        result = `.${arr[arr.length - 1]}`;
      }
      return result;
    }

    function getDetail() {
      return detailInfo.detail ? detailInfo.detail : '暂无内容';
    }

    return (
      <ContentLayout routerData={this.props.routerData}>
        <Spin spinning={loading}>
          <div className={common.linestyle}>基本信息</div>
          <div style={{ margin: '26px 0 0 18px', color: '#000', overflow: 'hidden' }}>
            申&nbsp;&nbsp;请&nbsp;&nbsp;人：{applyUser}
          </div>
          <div style={{ margin: '22px 0 26px 18px', color: '#000' }}>
            <span style={{ width: 580, float: 'left' }}>
              认证项目：{detailInfo.certificationItemName}
            </span>
            <span>提交时间：{moment(detailInfo.applyTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          </div>

          <div className={common.linestyle}>认证详情</div>
          {detailInfo.attachmentUrl && (
            <div className={common.downBox}>
              <span style={{ float: 'left' }}>
                附件：{getFileName()}
                {getFileType()}
              </span>
              <div className={common.downloadWrap}>
                <DownLoad
                  loadUrl={UPLOAD_HOST + detailInfo.attachmentUrl}
                  fileName={getFileName}
                  text={this.renderText()}
                  textClassName={common.myTextStyle}
                  progressClassName={common.myProgressStyle}
                  onError={status => this.onError(status)}
                  onChange={states => this.onChange(states)}
                />
              </div>
            </div>
          )}
          <div className={common.textstyle} dangerouslySetInnerHTML={{ __html: getDetail() }} />
        </Spin>
      </ContentLayout>
    );
  }
}

export default AuditDetail;
