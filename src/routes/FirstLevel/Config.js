import React from 'react';
import { Redirect, Switch, Route } from 'dva/router';
import { getRoutes } from '../../utils/utils';

class Config extends React.Component {
  render() {
    const { routerData, match } = this.props;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
          <Redirect exact from="/exception" to="/exception/404" />
        </Switch>
      </div>
    );
  }
}
export default Config;
