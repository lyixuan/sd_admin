import React from 'react';
import { Icon } from 'antd';
import { Switch, Route } from 'dva/router';
import styles from './changePwd.less';
import ModalDemo from '../selfComponent/Modal/Modal';
import { getRoutes } from '../utils/utils';

class ChangePwd extends React.Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    this.state = {
      isChangePwd: location.pathname === '/changePwd/changePassword',
      isShowDialog: false,
    };
  }

  backHome = () => {
    this.props.history.push('/');
  };
  showDiaLog = () => {
    this.setState({
      isShowDialog: true,
    });
  };

  render() {
    const { routerData, match } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <ModalDemo
            visible={this.state.isShowDialog}
            modalContent="确定停止修改密码"
            clickOK={e => this.backHome(e)}
            title="回到首页确认"
          />
          {!this.state.isChangePwd ? null : (
            <span className={styles.backHome} onClick={this.showDiaLog}>
              <Icon type="bank" className={styles.backIcon} />
              回到首页
            </span>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <i>{this.state.isChangePwd ? '修改密码' : '忘记密码'}</i>
          </div>
          <Switch>
            {getRoutes(match.path, routerData).map(item => (
              <Route
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ))}
          </Switch>
        </div>
      </div>
    );
  }
}

export default ChangePwd;
