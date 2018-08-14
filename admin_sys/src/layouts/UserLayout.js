import React from 'react';
import { Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';
import logo from '../assets/logo.png';

import { getRoutes } from '../utils/utils';

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '小德';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 小德`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.background} >
              <div className={styles.showContent}>
                <div className={styles.loginContainer}>
                  <div className={styles.loginContent}>
                    <span className={styles.header}>
                      <img src={logo} alt="logo" />
                      <h3>小德-后台管理系统</h3>
                    </span>
                    <div className={styles.login}>
                      <Switch>
                        {getRoutes(match.path, routerData).map(item => (
                          <Route
                            key={item.key}
                            path={item.path}
                            component={item.component}
                            exact={item.exact}
                          />
                        ))}
                        <Redirect exact from="/user" to="/userLayout/login" />
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
