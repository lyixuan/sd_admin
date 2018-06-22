import React, { Component } from 'react';
import { connect } from 'dva';
import Login from 'components/Login';
import PassWordErrorAlert from '../../selfComponent/passWordErrot/PassWordErrorAlert';
import styles from './Login.less';
import common from '../Common/common.css';

const { Submit, Password } = Login;

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
            <span className={styles.loginLabel}>原密码</span>
            <Password name="oldPassword" placeholder="请输入密码" />
            <span className={styles.loginLabel}>新密码</span>
            <Password name="newPassword" placeholder="请输入密码" />
            <span className={styles.loginLabel}>重复新密码</span>
            <Password name="repeadPassword" placeholder="请输入密码" />
            <Submit loading={submitting} type="primary" className={common.searchButton}>
              确认修改
            </Submit>
          </div>
        </Login>
      </div>
    );
  }
}
