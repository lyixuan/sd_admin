import React, { Component } from 'react';
import { connect } from 'dva';
import Login from 'components/Login';
import PassWordErrorAlert from '../../selfComponent/passWordErrot/PassWordErrorAlert';
import styles from './Login.less';
import common from '../Common/common.css';

const { Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class RetrievePassWord extends Component {
  state = {
    type: 'account',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    console.log(login);
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <PassWordErrorAlert style={{ width: '360px' }} errorMes="密码错误" />
          <div style={{ width: '360px' }}>
            <span className={styles.loginLabel}>新密码</span>
            <Password name="password" placeholder="请输入密码" />
            <span className={styles.loginLabel}>重复新密码</span>
            <Password name="rePassword" placeholder="请输入密码" />
            <Submit loading={submitting} type="primary" className={common.searchButton}>
              登录
            </Submit>
          </div>
        </Login>
      </div>
    );
  }
}
