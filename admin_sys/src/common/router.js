import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}
export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/indexPage': {
      component: dynamicWrapper(app, [], () => import('../routes/IndexPage/IndexPage')),
    },
    '/quality/qualityList': {
      component: dynamicWrapper(app, [], () => import('../routes/Quality/QualityList')),
    },
    '/quality/qualityAdd': {
      component: dynamicWrapper(app, [], () => import('../routes/Quality/QualityAdd')),
    },
    '/quality/qualityDel': {
      component: dynamicWrapper(app, [], () => import('../routes/Quality/QualityDel')),
    },
    '/account/accountList': {
      component: dynamicWrapper(app, [], () => import('../routes/Account/AccountList')),
    },
    '/account/createAccount': {
      component: dynamicWrapper(app, [], () => import('../routes/Account/CreateAccount')),
    },
    '/account/editAccount': {
      component: dynamicWrapper(app, [], () => import('../routes/Account/EditAccount')),
    },
    '/user/editUser': {
      component: dynamicWrapper(app, [], () => import('../routes/Users/EditUser')),
    },
    '/user/createUser': {
      component: dynamicWrapper(app, [], () => import('../routes/Users/CreateUser')),
    },
    '/user/checkUser': {
      component: dynamicWrapper(app, [], () => import('../routes/Users/CheckUser')),
    },
    '/user/userList': {
      component: dynamicWrapper(app, [], () => import('../routes/Users/UserList')),
    },
    '/role/editRole': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/EditRole')),
    },
    '/role/createrole': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/CreateRole')),
    },
    '/role/checkRole': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/CheckRole')),
    },
    '/role/roleList': {
      component: dynamicWrapper(app, [], () => import('../routes/Role/RoleList')),
    },
    '/refund/refundList': {
      component: dynamicWrapper(app, [], () => import('../routes/Refund/RefundList')),
    },
    '/refund/refundAdd': {
      component: dynamicWrapper(app, [], () => import('../routes/Refund/RefundAdd')),
    },
    '/refund/refundDel': {
      component: dynamicWrapper(app, [], () => import('../routes/Refund/RefundDel')),
    },
    '/Complaint/complaintList': {
      component: dynamicWrapper(app, [], () => import('../routes/Complaint/ComplaintList')),
    },
    '/complaint/complaintAdd': {
      component: dynamicWrapper(app, [], () => import('../routes/Complaint/ComplaintAdd')),
    },
    '/complaint/complaintDel': {
      component: dynamicWrapper(app, [], () => import('../routes/Complaint/ComplaintDel')),
    },
    '/shotName/Group': {
      component: dynamicWrapper(app, [], () => import('../routes/ShotName/Group')),
    },
    '/shotName/family': {
      component: dynamicWrapper(app, [], () => import('../routes/ShotName/Family')),
    },
    '/shotName/college': {
      component: dynamicWrapper(app, [], () => import('../routes/ShotName/College')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/userLayout': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/userLayout/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/Login/Login')),
    },
    '/userLayout/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/Login/Register')),
    },
    '/userLayout/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/Login/RegisterResult')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id

    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
      hideInMenu: router.hideInMenu || menuItem.hideInMenu,
    };
    routerData[path] = router;
  });
  return routerData;
};
