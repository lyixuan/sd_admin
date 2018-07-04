import React, { Component } from 'react';
import { connect } from 'dva';
import Login from 'components/Login';
import PassWordErrorAlert from '../../selfComponent/passWordErrot/PassWordErrorAlert';
import styles from './Login.less';
import common from '../Common/common.css';

const { Submit, Password } = Login;

@connect(({ password, loading }) => ({
  password,
  submitting: loading.effects['password/updatePwd'],
}))
export default class RetrievePassWord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: ' ',
      isShowError: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.password.changePwdObj) !==
      JSON.stringify(this.props.password.changePwdObj)
    ) {
      console.log(nextProps.password.changePwdObj);
      const { msg, status } = nextProps.password.changePwdObj;
      if (!status) {
        this.setState({
          errorMsg: msg,
          isShowError: !status,
        });
      }
    }
  }
  handleSubmit = (err, values) => {
    if (!err) {
      const { oldPassword, password, repeadPassword } = values;
      if (password !== repeadPassword) {
        this.setState({
          isShowError: true,
          errorMsg: '两次密码输入不一致',
        });
      } else {
        this.props.dispatch({
          type: 'password/updatePwd',
          payload: {
            oldPassword,
            password,
          },
        });
      }
    }
  };

  render() {
    const { submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <PassWordErrorAlert
            style={{ width: '360px' }}
            errorMes={this.state.errorMsg}
            isShow={this.state.isShowError}
          />
          <div style={{ width: '360px' }}>
            <span className={styles.loginLabel}>原密码</span>
            <Password name="oldPassword" placeholder="请输入密码" />
            <span className={styles.loginLabel}>新密码</span>
            <Password name="password" placeholder="请输入密码" />
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
