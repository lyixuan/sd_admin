import React, { Component } from 'react';
import { connect } from 'dva';
import Login from 'components/Login';
import PassWordErrorAlert from '../../selfComponent/passWordErrot/PassWordErrorAlert';
import styles from './Login.less';
import common from '../Common/common.css';

const { Captcha, Submit, Emil } = Login;

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
  clickCaptcha = () => {
    console.log('验证码');
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
    const { submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <PassWordErrorAlert style={{ width: '360px' }} errorMes="密码错误" />
          <div style={{ width: '360px' }}>
            <span className={styles.loginLabel}>邮箱</span>
            <Emil name="emil" placeholder="请输入密码" />
            <span className={styles.loginLabel}>验证码</span>
            <Captcha
              name="rePassword"
              placeholder="请输入验证码"
              onChange={this.clickCaptcha}
              showcaptcha="1111"
            />
            <Submit loading={submitting} type="primary" className={common.searchButton}>
              登录
            </Submit>
          </div>
        </Login>
      </div>
    );
  }
}
