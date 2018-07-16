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
      showSuccessModal: false,
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
        showSuccessModal: status,
      });
    }
  }

  onBlur = e => {
    const mail = e.target.value ? `${e.target.value}@sunlands.com` : '';
    this.setState({ mail }, this.getAuthCode);
  };
  getAuthCode = () => {
    const self = this;
    const [mail, v] = [this.state.mail, new Date().valueOf()];
    generateAuthCode({ mail, v }).then(src => {
      const showCaptcha = src;
      self.setState({ showCaptcha });
    });
  };
  fnTiggleModal = bol => {
    this.setState({
      showSuccessModal: bol,
    });
  };
  handleSubmit = (err, values) => {
    if (!err) {
      const mail = `${values.mail}@sunlands.com`;
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
    const { showCaptcha, msg, status, mail, showSuccessModal } = this.state;
    return (
      <div className={styles.main}>
        {!showSuccessModal ? null : (
          <ModalDemo
            visible={showSuccessModal}
            title="提示"
            clickOK={this.clickOK}
            modalContent={`小德已经给您的企业邮箱${mail}发送了找回密码邮件,请在2个小时内查收邮件,完成找回密码的操作.`}
            footButton={['确定']}
            showModal={bol => this.fnTiggleModal(bol)}
          />
        )}
        <Login onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <PassWordErrorAlert style={{ width: '360px' }} errorMes={msg} isShow={status === false} />
          <div style={{ width: '360px' }}>
            <span className={styles.loginLabel}>邮箱</span>
            <Emil name="mail" placeholder="请输入邮箱" onBlur={this.onBlur} />
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
