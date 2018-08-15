import React from 'react';
import { Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';
import logoWord from '../assets/bg_word.png';
import logoImg from '../assets/bg_logo.png';
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
            <div className={styles.imgContent}>
              <img src={logoWord} alt="小德" className={styles.adminImg} />
            </div>

            <div className={styles.background} >
              <div className={styles.showContent}>
                <div className={styles.logoContent}>
                  <img src={logoImg} alt="小德logo" className={styles.logoImg} />
                </div>
                <div className={styles.loginContainer}>
                  <div className={styles.loginContent}>
                    <span className={styles.header}>登录小德后台管理系统</span>
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



            <div className={styles.wordContent}>
              <span className={styles.wordBottom}>北京尚德在线教育机构 | 后端运营中心</span>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
