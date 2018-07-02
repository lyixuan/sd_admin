import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';
import { checkoutLogin } from './utils/checkoutUserAuthInfo';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});
function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/userLayout'].component;
  const BasicLayout = routerData['/'].component;
  const noAuthoried = routerData['/exception/403'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/userLayout" component={UserLayout} />
          <Route path="/exception/403" component={noAuthoried} />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={checkoutLogin}
            redirectPath="/userLayout/login"
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
