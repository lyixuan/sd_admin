import React from 'react';
import { routerRedux } from 'dva/router';
// import { Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva/index';
import storage from '../utils/storage';

function isLogin() {
  return storage.getItem('admin_user') && storage.getItem('admin_user').userId;
}

class UserLayout extends React.PureComponent {
  UNSAFE_componentWillMount() {
    if (!isLogin) {
      this.initSysItem();
    } else {
      this.props.dispatch(routerRedux.push({ pathname: '/' }));
    }
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
    // const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div>1</div>
      </DocumentTitle>
    );
  }
}
export default connect(({ login, loading }) => ({
  isLoginIng: loading.effects['login/initSubSystem'],
  login,
}))(UserLayout);
