import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';

class DownLoad extends Component {
  static propTypes = {
    onPreview: PropTypes.func, //  点击下载时的回调
    onChange: PropTypes.func, //  下载回调
    loadUrl: PropTypes.string, //  下载文件地址
    onError: PropTypes.func, //   处理异常
    fileName: PropTypes.func, //   自定义文件名
    progress: PropTypes.node, //   自定义进度条
    headers: PropTypes.object, //   设置请求头
    text: PropTypes.node, //   显示文案信息
  };
  static defaultProps = {
    onPreview: null,
    onChange: null,
    loadUrl: '',
    onError: null,
    fileName: null,
    progress: null,
    headers: {},
    text: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      isShowProgressComponent: false,
      percent: 0,
    };
  }
  onLoad = () => {
    if (!this.props.loadUrl) return;
    this.ajax(this.props.loadUrl);
    if (this.props.onPreview) this.props.onPreview();
    this.showProgressWrapperPanel();
  };
  onCompile = xhr => {
    const { response } = xhr;
    let a = document.createElement('a');
    const url = window.URL.createObjectURL(response);
    a.href = url;
    a.download = this.props.fileName ? this.props.fileName(xhr) : '自定义';
    a.click();
    this.hideProgressWrapperPanel();
    a = null;
  };
  ajax = url => {
    const { headers } = this.props;
    let xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new window.XMLHttpRequest();
    } else {
      xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    if (headers) {
      Object.keys(headers).forEach(item => {
        xhr.setRequestHeader(item, headers[item]);
      });
    }
    xhr.onprogress = e => {
      this.updateProgressWrapper(e.loaded, e.total, xhr);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.onCompile(xhr);
      } else if (this.props.onError && xhr.status !== 200) {
        this.props.onError(xhr.status);
        this.hideProgressWrapperPanel();
      }
    };
    xhr.send();
  };
  showProgressWrapperPanel = () => {
    // 显示进度组
    this.setState({ isShowProgressComponent: true, percent: 0 });
  };
  hideProgressWrapperPanel = () => {
    // 显示进度组
    this.setState({ isShowProgressComponent: false });
  };
  updateProgressWrapper = (loaded = 0, total, xhr) => {
    const percent = Math.floor(loaded / total * 100);
    if (this.props.onChange && xhr.status === 200) {
      this.props.onChange({
        states: percent >= 100 ? 'loaded' : 'loading',
        percent,
      });
    }
    this.setState({ percent });
  };
  renderProgress = percent => {
    return this.props.progress || <Progress percent={percent} type="line" strokeColor="#FD9829" />;
  };
  renderText = () => {
    return this.props.text || '下载';
  };
  render() {
    const { isShowProgressComponent, percent } = this.state;
    const { textClassName, progressClassName } = this.props;
    const textStyle = {
      float: 'left',
    };
    const progressStyle = {
      float: 'left',
      width: '100px',
      marginLeft: '10px',
    };
    return (
      <>
        <span
          className={textClassName}
          style={textStyle}
          onClick={e => !isShowProgressComponent && this.onLoad(e)}
        >
          {this.renderText()}
        </span>
        {isShowProgressComponent ? (
          <span className={progressClassName} style={progressStyle}>
            {this.renderProgress(percent)}
          </span>
        ) : null}
      </>
    );
  }
}
export default DownLoad;
