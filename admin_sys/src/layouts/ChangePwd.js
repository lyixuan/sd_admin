import React from 'react';
import { Switch, Route } from 'dva/router';
import styles from './changePwd.less';
import { getRoutes } from '../utils/utils';

class ChangePwd extends React.Component {
  render() {
    const { routerData, match } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header} />
        <div className={styles.content}>
          <div className={styles.title}>
            <i>找回密码</i>
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
