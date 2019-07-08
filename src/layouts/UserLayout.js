import React from 'react';
// import { Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva/index';
// import { getRoutes } from '../utils/utils';

class UserLayout extends React.PureComponent {
  UNSAFE_componentWillMount() {
    this.initSysItem();
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '小德';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 小德`;
    }
    return title;
  }
  initSysItem = () => {
    this.props.dispatch({
      type: 'login/initSubSystem',
    });
  };
  render() {
    return <DocumentTitle title={this.getPageTitle()}>&ngsp;</DocumentTitle>;
  }
}
export default connect(({ login, loading }) => ({
  isLoginIng: loading.effects['login/initSubSystem'],
  login,
}))(UserLayout);
