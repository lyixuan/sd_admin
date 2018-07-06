import React, { Component } from 'react';
import { connect } from 'dva';
import { parse } from 'url';
import { routerRedux } from 'dva/router';
import Login from 'components/Login';
import PassWordErrorAlert from '../../selfComponent/passWordErrot/PassWordErrorAlert';
import styles from './Login.less';
import common from '../Common/common.css';

const { Password, Submit } = Login;

@connect(({ password, loading }) => ({
  password,
  submitting: loading.effects['login/login'],
}))
export default class RetrievePassWord extends Component {
  constructor(props) {
    super(props);
    const urlParams = parse(this.props.location.search, true).query;
    const { validate = false, userId = '', token = '' } = urlParams;
    this.state = {
      validate,
      userId,
      token,
    };
  }

  componentDidMount() {
    const { validate } = this.state;
    if (!validate || validate === 'false') {
      this.props.dispatch(routerRedux.push({ pathname: '/exception/failUrl' }));
    }
  }

  handleSubmit = (err, values) => {
    if (!err) {
      const { userId, token } = this.state;
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          userId,
          token,
        },
      });
    }
  };

  render() {
    const { submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <PassWordErrorAlert style={{ width: '360px' }} errorMes="密码错误" />
          <div style={{ width: '360px' }}>
            <span className={styles.loginLabel}>新密码</span>
            <Password name="password" placeholder="请输入密码" />
            <span className={styles.loginLabel}>重复新密码</span>
            <Password name="rePassword" placeholder="请重复密码" />
            <Submit loading={submitting} type="primary" className={common.searchButton}>
              登录
            </Submit>
          </div>
        </Login>
      </div>
    );
  }
}
