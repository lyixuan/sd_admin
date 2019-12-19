import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { ADMIN_USER, ADMIN_AUTH_LIST } from '@/utils/constants';
import Footer from './Footer';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import biIcon from '../assets/touxiang.png';
import logo from '../assets/menu/logo.png';
import { getAuthority } from '../utils/authority';
import { checkPathname, addRouteData } from '../common/isCheckAuth';
import HeaderLayout from './Header';
import style from './basic.less';

const { Content } = Layout;
const { AuthorizedRoute, check } = Authorized;
/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
  };

  getChildContext() {
    const { location, routerData, menuData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(menuData, routerData),
    };
  }
  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });

    this.MenuData();
    this.setRedirectData(this.props.menuData);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.menuData) !== JSON.stringify(this.props.menuData)) {
      this.setRedirectData(nextProps.menuData);
    }
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
  setRedirectData = menuData => {
    menuData.forEach(getRedirect);
  };

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '小德';
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - 小德`;
    }
    return title;
  }

  getBaseRedirect = () => {
    const urlParams = new URL(window.location.href);
    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item =>
          check(routerData[item].authority, item) && item !== '/' && !routerData[item].hideInMenu
      );
      return authorizedPath;
    }
    return redirect;
  };
  handleUserInfo = () => {
    const { userName = '小德' } = getAuthority(ADMIN_USER);
    return { name: userName };
  };
  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  };
  MenuData = () => {
    const routeData = getAuthority(ADMIN_AUTH_LIST) || [];
    this.props.dispatch({
      type: 'menu/getMenu',
      payload: { routeData },
    });
  };

  render() {
    const { collapsed, fetchingNotices, notices, match, location } = this.props;
    let { routerData } = this.props;
    const { menuData } = this.props;
    const currentUser = this.handleUserInfo();
    currentUser.avatar = biIcon;
    const bashRedirect = this.getBaseRedirect();
    routerData = addRouteData(routerData);
    const layout = (
      <>
        <Layout>
          <HeaderLayout
            {...this.props}
            logo={biIcon}
            currentUser={currentUser}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            isMobile={this.state.isMobile}
            onCollapse={this.handleMenuCollapse}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
          />

          <Layout className={style.contentLayout}>
            <SiderMenu
              logo={logo}
              // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
              // If you do not have the Authorized parameter
              // you will be forced to jump to the 403 interface without permission
              // Authorized={Authorized}
              menuData={menuData}
              collapsed={collapsed}
              location={location}
              isMobile={this.state.isMobile}
              onCollapse={this.handleMenuCollapse}
            />

            <Content>
              <Switch>
                {redirectData.map(item => (
                  <Redirect key={item.from} exact from={item.from} to={item.to} />
                ))}
                {getRoutes(match.path, routerData).map(item => {
                  const patchname = item.path;
                  return (
                    <AuthorizedRoute
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                      authority={checkPathname.bind(null, patchname)}
                      redirectPath="/exception/403"
                    />
                  );
                })}
                <Redirect exact from="/" to={bashRedirect} />
                <Route render={NotFound} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
        <Footer />
      </>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ global, menu, login, loading }) => ({
  currentUser: login.currentUser,
  isLoginIng: loading.effects['login/initSubSystem'],
  login,
  menuData: menu.menuData,
  collapsed: global.collapsed,
}))(BasicLayout);
