import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {stringify} from 'qs';
import { parse } from 'url';
import Authorized from './Authorized';
import {checkoutAuthRoute} from '../../utils/checkoutUserAuthInfo'
class AuthorizedRoute extends React.Component {
  getUrlParams(){
    return parse(this.location.search,true).query;
  }
  setCurrentUrlParams(query=null){        //传入参数统一为对象
    const pathname=this.history.location.pathname;
    const originSearch=parse(this.history.location.search,true).query||null;
    const paramsObj={...originSearch,...query};
    this.history.push({
      pathname:pathname,
      search:stringify(paramsObj),
    });
  }
  setRouteUrlParams(pathname,query=null){
    if(pathname){
      this.history.push({
        pathname:pathname,
        search:stringify(query),
      });
    }else{
      console.warn('输入路径地址')
    }
  }
  render() {
    const { component: Component, render, authority, redirectPath, ...rest } = this.props;
    const pathname=this.props.location.pathname;
    return (
      <Authorized
        authority={checkoutAuthRoute.bind(null,pathname)}
         noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: '/exception/403' }} />} />}
      >
          <Route {...rest} render={props => (Component ? <Component {...props}
                                                                    getUrlParams={this.getUrlParams}
                                                                    setCurrentUrlParams={this.setCurrentUrlParams}
                                                                    setRouteUrlParams={this.setRouteUrlParams}/> : render(props))}/>
      </Authorized>
    );
  }
}

export default AuthorizedRoute;
