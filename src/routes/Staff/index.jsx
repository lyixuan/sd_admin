import React from 'react';
import { Redirect, Switch, Route } from 'dva/router';
import { getRoutes } from 'utils/utils';

class Staff extends React.Component {
  render() {
    const { routerData, match } = this.props;
    return (
      <Switch>
        {getRoutes(match.path, routerData).map(item => (
          <Route
            key={item.key}
            path={item.path}
            component={item.component}
            exact={item.exact}
            authority={item.authority}
            redirectPath="/exception/403"
          />
        ))}
        <Redirect exact from="/privilege/staff" to="/privilege/staff/staffList" />
      </Switch>
    );
  }
}
export default Staff;
