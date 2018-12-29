import React, { PureComponent } from 'react';
import { Route, Switch } from 'dva/router';
import { getRoutes } from 'utils/router.utils';

export default class RenderRoute extends PureComponent {
  render() {
    const { match, routerData } = this.props;
    const routes = getRoutes(match.path, routerData);
    return (
      <Switch>
        {routes.map(item => (
          <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
        ))}
      </Switch>
    );
  }
}
