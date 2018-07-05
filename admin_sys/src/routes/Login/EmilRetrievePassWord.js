import React, { Component } from 'react';
import { connect } from 'dva';
import Login from 'components/Login';
import { generateAuthCode } from '../../services/api';
import PassWordErrorAlert from '../../selfComponent/passWordErrot/PassWordErrorAlert';
import styles from './Login.less';
import common from '../Common/common.css';
import ModalDemo from '../../selfComponent/Modal/Modal';

const { Captcha, Submit, Emil } = Login;

@connect(({ password, loading }) => ({
  password,
  submitting: loading.effects['password/findBackPwd'],
}))
export default class RetrievePassWord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      status: null,
      showCaptcha: '',
      mail: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.password.findBackPwdObj) !==
      JSON.stringify(this.props.password.findBackPwdObj)
    ) {
      const { msg, status, mail } = nextProps.password.findBackPwdObj;
      this.setState({
        msg,
        status,
        mail,
      });
    }
  }

  onFocus = () => {
    if (!this.state.showCaptcha) {
      this.getAuthCode();
    }
  };
  getAuthCode = () => {
    const self = this;
    generateAuthCode().then(src => {
      const showCaptcha = src;
      self.setState({ showCaptcha });
    });
  };
  handleSubmit = (err, values) => {
    if (!err) {
      // const mail = `${values.mail}@sunlands.com`;
      const mail = '623570688@qq.com';
      this.props.dispatch({
        type: 'password/findBackPwd',
        payload: {
          ...values,
          mail,
        },
      });
    }
  };
  clickOK = () => {
    window.location.href = 'http://mail.sunlands.com/';
  };

  render() {
    const { submitting } = this.props;
    const { showCaptcha, msg, status, mail } = this.state;
    return (
      <div className={styles.main}>
        {!status ? null : (
          <ModalDemo
            visible={status === true}
            title="提示"
            clickOK={this.clickOK}
            modalContent={`小德已经给您的企业邮箱${mail}发送了找回密码邮件,请在2个小时内查收邮件,完成找回密码的操作.`}
            footButton={['确定']}
          />
        )}
        <Login onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <PassWordErrorAlert style={{ width: '360px' }} errorMes={msg} isShow={status === false} />
          <div style={{ width: '360px' }}>
            <span className={styles.loginLabel}>邮箱</span>
            <Emil name="mail" placeholder="请输入邮箱" onFocus={this.onFocus} />
            {showCaptcha ? (
              <div>
                <span className={styles.loginLabel}>验证码</span>
                <Captcha
                  name="verCode"
                  placeholder="请输入验证码"
                  onGetCaptcha={this.getAuthCode}
                  showcaptcha={showCaptcha}
                />
              </div>
            ) : null}
            <Submit loading={submitting} type="primary" className={common.searchButton}>
              确定
            </Submit>
          </div>
        </Login>
      </div>
    );
  }
}
