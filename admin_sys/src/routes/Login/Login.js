import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox } from 'antd';
import { routerRedux } from 'dva/router';
import Login from 'components/Login';
import PassWordErrorAlert from '../../selfComponent/passWordErrot/PassWordErrorAlert';
import styles from './Login.less';
import { getAuthority } from '../../utils/authority';
import { formatEmail } from '../../utils/email';

const { Emil, Submit, NoHintPwd } = Login;
function checkoutLoginObj(loginObj, key) {
  if (loginObj && typeof loginObj === 'object' && loginObj[key]) {
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
      isShowErrorBox: true,
      adminUser: {
        mail: mail ? formatEmail(mail) : '',
        password: password ? formatEmail(password) : '',
      },
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.login.loginStatusObj) !==
      JSON.stringify(this.props.login.loginStatusObj)
    ) {
      this.setState({
        errorMessage: nextProps.login.loginStatusObj.msg,
        isShowErrorBox: nextProps.login.loginStatusObj.status,
      });
    }
  }

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
  callBackPwd = () => {
    this.props.dispatch(routerRedux.push({ pathname: '/changePwd/emilRetrieve' }));
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
          <div style={{ width: '340px', height: '40px' }}>
            <PassWordErrorAlert
              style={{ width: '340px' }}
              errorMes={errorMessage}
              isShow={!isShowErrorBox}
            />
          </div>
          <div style={{ width: '340px' }}>
            <span className={styles.loginLabel} style={{ marginTop: '0px' }}>
              邮箱
            </span>
            <Emil name="mail" placeholder="请输入邮箱" defaultValue={adminUser.mail} />
            <span className={styles.loginLabel}>密码</span>
            <NoHintPwd name="password" placeholder="请输入密码" defaultValue={adminUser.password} />
            <div className={styles.loginStatusBox}>
              <span style={{ float: 'left' }}>
                <Checkbox checked={this.state.autoLogin} style={{color:'#787878',fontSize:'12px'}} onChange={this.changeAutoLogin}>
                  自动登录
                </Checkbox>
              </span>
              <span className={styles.callBackPwd} onClick={this.callBackPwd}>
                忘记密码
              </span>
            </div>
            <Submit loading={submitting} type="primary" className={styles.searchButton}>
              登录
            </Submit>
          </div>
        </Login>
      </div>
    );
  }
}
