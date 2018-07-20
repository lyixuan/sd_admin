import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'dva/router';
import style from './pageHead.css';

export default class PageHead extends React.Component {
  getRouterPathname = () => {
    const { routerData = {} } = this.props;
    const { pathname = '' } = window.location;
    const routeObj = routerData[pathname];
    return routeObj;
  };
  render() {
    const routeObj = this.getRouterPathname();
    const { bread, name } = routeObj;
    return (
      <div className={style.pagehead}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={bread.path}>{bread.name}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  }
}
