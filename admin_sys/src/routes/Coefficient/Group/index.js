import React from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { getRoutes } from 'utils/utils';

export default class Group extends React.Component {
  render() {
    const { routerData, match } = this.props;
    return (
      <Switch>
        {getRoutes(match.path, routerData).map(item => (
          <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
        ))}
        <Redirect
          exact
          from="/performance/groupCoefficient"
          to="/performance/groupCoefficient/list"
        />
      </Switch>
    );
  }
}
