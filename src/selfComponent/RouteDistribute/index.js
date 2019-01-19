import React, { PureComponent } from 'react';
import { Redirect, Switch } from 'dva/router';
import { getRoutes } from 'utils/router.utils';
import Authorized from 'utils/Authorized';

const { AuthorizedRoute } = Authorized;
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.redirect) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.redirect}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};

export default class RouteDistribute extends PureComponent {
  componentDidMount() {
    const { routerData, rootPath } = this.props;
    const menuData = routerData[rootPath];
    getRedirect(menuData);
  }

  render() {
    const { match, routerData } = this.props;
    return (
      <Switch>
        {redirectData.map(item => <Redirect key={item.from} exact from={item.from} to={item.to} />)}
        {getRoutes(match.path, routerData).map(
          item =>
            item.component && (
              <AuthorizedRoute
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
                authority={item.authority}
                redirectPath="/exception/403"
              />
            )
        )}
        <Redirect exact from="/" to="/home/page" />
      </Switch>
    );
  }
}
