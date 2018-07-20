import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import Content from './Content';
import PageHead from '../selfComponent/pageHead/pageHead';
import styles from './Content.less';

class ContentLayout extends Component {
  getRouterPathname = () => {
    const { routerData = {} } = this.props;
    const { pathname = '' } = window.location;
    const pathRegexp = pathToRegexp(pathname);
    let routeObj = {};
    Object.keys(routerData).forEach(item => {
      if (pathRegexp.test(`${item}`)) {
        routeObj = routerData[item];
      }
    });
    return routeObj || {};
  };

  render() {
    // const title = !this.props.title ? null : this.props.title;
    const { routerData = null } = this.props;
    const routeObj = this.getRouterPathname();
    const { name = '', bread } = routeObj;
    return (
      <div className={styles.contentLayout}>
        <div className={styles.bread}>
          {routerData && bread && <PageHead routerData={routerData} />}
        </div>
        {name && <div className={styles.title}>{name}</div>}
        <Content>
          {!this.props.contentForm ? null : this.props.contentForm}
          {!this.props.contentButton ? null : this.props.contentButton}
          {!this.props.contentTable ? null : this.props.contentTable}
          {!this.props.contentPagination ? null : this.props.contentPagination}
          {!this.props.bottomLine ? null : this.props.bottomLine}
        </Content>
      </div>
    );
  }
}

export default ContentLayout;
