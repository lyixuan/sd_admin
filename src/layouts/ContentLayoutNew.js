import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import { Tabs } from 'antd';
import ContentNew from './ContentNew';
import styles from './ContentNew.less';

const { TabPane } = Tabs;
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

  callback = key => {
    this.props.setRouteUrlParams(key);
  };
  render() {
    // const title = !this.props.title ? null : this.props.title;
    const { tab } = this.props;
    const routeObj = this.getRouterPathname();
    const { name = '' } = routeObj;

    const tabs = tab.map(v => <TabPane tab={v.name} key={v.path} />);

    let crtTab = '';
    for (let i = 0; i < tab.length; i += 1) {
      if (tab[i].name === name) {
        crtTab = tab[i].path;
      }
    }
    return (
      <div className={styles.contentLayout}>
        <div style={{ background: '#fff', paddingLeft: 16 }}>
          <Tabs defaultActiveKey={crtTab} onChange={this.callback}>
            {tabs}
          </Tabs>
        </div>
        <ContentNew>
          {!this.props.contentForm ? null : this.props.contentForm}
          {!this.props.contentButton ? null : this.props.contentButton}
          {!this.props.contentTable ? null : this.props.contentTable}
          {!this.props.contentPagination ? null : this.props.contentPagination}
          {!this.props.bottomLine ? null : this.props.bottomLine}
          {this.props.children && { ...this.props.children }}
        </ContentNew>
      </div>
    );
  }
}

export default ContentLayout;
