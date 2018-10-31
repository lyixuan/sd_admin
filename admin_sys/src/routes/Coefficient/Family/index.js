import React from 'react';
// import { Route, Redirect, Switch } from 'dva/router';
// import { getRoutes } from 'utils/utils';

export default class Family extends React.Component {
  render() {
    // const { routerData, match } = this.props;
    return (
      <div>dddd</div>
      //     <Switch>
      //     {redirectData.map(item => (
      //       <Redirect key={item.from} exact from={item.from} to={item.to} />
      //     ))}
      //     {getRoutes(match.path, routerData).map(item => {
      //       const patchname = item.path;
      //       return (
      //         <AuthorizedRoute
      //           key={item.key}
      //           path={item.path}
      //           component={item.component}
      //           exact={item.exact}
      //           authority={checkPathname.bind(null, patchname)}
      //           redirectPath="/exception/403"
      //         />
      //       );
      //     })}
      //     <Redirect exact from="/" to={bashRedirect} />
      //     <Route render={NotFound} />
      //   </Switch>
    );
  }
}
