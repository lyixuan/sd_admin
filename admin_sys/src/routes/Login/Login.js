import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox } from 'antd';
import Login from 'components/Login';
import PassWordErrorAlert from '../../selfComponent/passWordErrot/PassWordErrorAlert';
import styles from './Login.less';
import common from '../Common/common.css';
import { getAuthority } from '../../utils/authority';
import { formatEmail } from '../../utils/email';

const { Emil, Password, Submit } = Login;
function checkoutLoginObj(loginObj, key) {
  if (loginObj && typeof loginObj === 'object' && loginObj.token) {
    return loginObj[key];
  } else return '';
}

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  constructor(props) {
    const localAdminUser = getAuthority('admin_user') || {};
    const mail = checkoutLoginObj(localAdminUser, 'mail');
    const password = checkoutLoginObj(localAdminUser, 'password');
    super(props);
    this.state = {
      type: 'account',
      autoLogin: true,
      errorMessage: '',
      isShowErrorBox: false,
      adminUser: {
        mail: formatEmail(mail),
        password: formatEmail(password),
      },
    };
  }

  // showErrorMessage = errorMessage => {
  //   this.setState({
  //     isShowErrorBox: true,
  //     errorMessage,
  //   });
  // };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { autoLogin } = this.state;
      const mail = `${values.mail}@sunlands.com`;
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          mail,
          autoLogin,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  render() {
    const { submitting } = this.props;
    const { type, adminUser, errorMessage, isShowErrorBox } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <PassWordErrorAlert
            style={{ width: '340px' }}
            errorMes={errorMessage}
            isShow={isShowErrorBox}
          />
          <div style={{ width: '340px' }}>
            <span className={styles.loginLabel}>邮箱</span>
            <Emil name="mail" placeholder="请输入邮箱" defaultValue={adminUser.mail} />
            <span className={styles.loginLabel}>密码</span>
            <Password name="password" placeholder="请输入密码" defaultValue={adminUser.password} />
            <div>
              <span style={{ float: 'left' }}>
                <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
                  自动登录
                </Checkbox>
              </span>
              <span style={{ float: 'right' }}>忘记密码</span>
            </div>
            <Submit loading={submitting} type="primary" className={common.searchButton}>
              登录
            </Submit>
          </div>
        </Login>
      </div>
    );
  }
}
