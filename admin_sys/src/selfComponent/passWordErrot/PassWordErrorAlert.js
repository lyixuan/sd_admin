import React, { Component } from 'react';
import { Alert } from 'antd';
import styles from './passWordErrorAlert.less';

export default class PassWordErrorAlert extends Component {
  state = {};

  renderMessage = content => {
    return <Alert message={content} type="error" showIcon />;
  };

  render() {
    return !this.props.isShow ? null : (
      <div className={styles.errorBox} style={this.props.style}>
        {this.renderMessage(this.props.errorMes)}
      </div>
    );
  }
}
