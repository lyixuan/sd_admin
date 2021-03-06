import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import {
  getUrlParams,
  getLastUrlParams,
  setRouteUrlParams,
  setCurrentUrlParams,
} from './routerParams';

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
      const lastUrlParams = getLastUrlParams(app);
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
            lastUrlParams,
            setRouteUrlParams,
            setCurrentUrlParams,
            urlParams: getUrlParams(app),
            getUrlParams: () => getUrlParams(app),
          });
      });
    },
  });
};

// function getFlatMenuData(menus) {
//   let keys = {};
//   menus.forEach(item => {
//     if (item.children) {
//       keys[item.path] = { ...item };
//       keys = { ...keys, ...getFlatMenuData(item.children) };
//     } else {
//       keys[item.path] = { ...item };
//     }
//   });
//   return keys;
// }

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['login'], () => import('../layouts/BasicLayout')),
    },
    '/indexPage': {
      component: dynamicWrapper(app, [], () => import('../routes/IndexPage/IndexPage')),
    },
    '/quality/qualityList': {
      component: dynamicWrapper(app, ['quality'], () => import('../routes/Quality/QualityList')),
      name: '质检信息',
    },
    '/quality/qualityAdd': {
      component: dynamicWrapper(app, ['quality'], () => import('../routes/Quality/QualityAdd')),
      bread: {
        name: '质检管理',
        path: '/quality/qualityList',
      },
      name: '添加质检',
    },
    '/quality/qualityDel': {
      component: dynamicWrapper(app, ['quality'], () => import('../routes/Quality/QualityDel')),
      bread: {
        name: '质检管理',
        path: '/quality/qualityList',
      },
      name: '删除质检',
    },
    '/config/accountList': {
      component: dynamicWrapper(app, ['account'], () => import('../routes/Account/AccountList')),
      name: '账号信息',
    },
    '/account/createAccount': {
      component: dynamicWrapper(app, ['account'], () => import('../routes/Account/CreateAccount')),
      bread: {
        name: '账号管理',
        path: '/config/accountList',
      },
      name: '创建账号',
    },
    '/account/editAccount': {
      component: dynamicWrapper(app, ['account'], () => import('../routes/Account/EditAccount')),
      bread: {
        name: '账号管理',
        path: '/config/accountList',
      },
      name: '编辑账号',
    },
    '/user/editUser': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/Users/EditUser')),
      bread: {
        name: '账号管理',
        path: '/config/userList',
      },
      name: '编辑用户',
    },
    '/user/createUser': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/Users/CreateUser')),
      bread: {
        name: '账号管理',
        path: '/config/userList',
      },
      name: '创建用户',
    },
    '/user/checkUser': {
      component: dynamicWrapper(app, [], () => import('../routes/Users/CheckUser')),
      bread: {
        name: '账号管理',
        path: '/config/userList',
      },
      name: '查看用户',
    },
    '/config/userList': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/Users/UserList')),
      name: '账号管理',
    },
    '/privilege/staff': {
      component: dynamicWrapper(app, ['staff'], () => import('../routes/Staff/index')),
      name: '绩效用户管理',
    },
    '/privilege/staff/staffList': {
      component: dynamicWrapper(app, ['staff'], () => import('../routes/Staff/StaffList')),
      name: '绩效用户管理',
    },
    '/privilege/staff/detail': {
      component: dynamicWrapper(app, ['staff'], () => import('../routes/Staff/StaffDetail')),
      bread: {
        name: '绩效用户管理',
        path: '/privilege/staff',
      },
      name: '查看详情',
    },
    '/privilege/staff/createTransJob': {
      component: dynamicWrapper(app, ['staff', 'user'], () =>
        import('../routes/Staff/CreateTransJob')
      ),
      bread: {
        name: '绩效用户管理',
        path: '/privilege/staff',
      },
      name: '创建转岗',
    },
    '/privilege/staff/createHoliday': {
      component: dynamicWrapper(app, ['staff'], () => import('../routes/Staff/CreateHoliday')),
      bread: {
        name: '绩效用户管理',
        path: '/privilege/staff',
      },
      name: '创建休假',
    },
    '/privilege/staff/createDimission': {
      component: dynamicWrapper(app, ['staff'], () => import('../routes/Staff/CreateDimission')),
      bread: {
        name: '绩效用户管理',
        path: '/privilege/staff',
      },
      name: '创建离职',
    },
    '/privilege/staff/editTransJob': {
      component: dynamicWrapper(app, ['staff', 'user'], () =>
        import('../routes/Staff/EditTransJob')
      ),
      bread: {
        name: '绩效用户管理',
        path: '/privilege/staff',
      },
      name: '编辑转岗',
    },
    '/privilege/staff/editHoliday': {
      component: dynamicWrapper(app, ['staff'], () => import('../routes/Staff/EditHoliday')),
      bread: {
        name: '绩效用户管理',
        path: '/privilege/staff',
      },
      name: '编辑休假',
    },
    '/privilege/staff/editDimission': {
      component: dynamicWrapper(app, ['staff'], () => import('../routes/Staff/EditDimission')),
      bread: {
        name: '绩效用户管理',
        path: '/privilege/staff',
      },
      name: '编辑离职',
    },

    '/permission/editPermission': {
      component: dynamicWrapper(app, ['permission'], () =>
        import('../routes/Permission/EditPermission')
      ),
      bread: {
        name: '权限管理',
        path: '/config/permissionList',
      },
      name: '编辑权限',
    },
    '/permission/createPermission': {
      component: dynamicWrapper(app, ['permission'], () =>
        import('../routes/Permission/CreatePermission')
      ),
      bread: {
        name: '权限管理',
        path: '/config/permissionList',
      },
      name: '创建权限',
    },
    '/config/permissionList': {
      component: dynamicWrapper(app, ['permission'], () =>
        import('../routes/Permission/PermissionList')
      ),
      name: '权限管理',
    },

    '/config/cacheManage': {
      component: dynamicWrapper(app, ['cacheManage'], () =>
        import('../routes/CacheManage/CacheManage')
      ),
      name: '学分缓存',
    },

    '/role/editRole': {
      component: dynamicWrapper(app, ['role'], () => import('../routes/Role/EditRole')),
      bread: {
        name: '角色管理',
        path: '/config/roleList',
      },
      name: '编辑角色',
    },
    '/role/createrole': {
      component: dynamicWrapper(app, ['role'], () => import('../routes/Role/CreateRole')),
      bread: {
        name: '角色管理',
        path: '/config/roleList',
      },
      name: '创建角色',
    },
    '/role/checkRole': {
      component: dynamicWrapper(app, ['role'], () => import('../routes/Role/CheckRole')),
      bread: {
        name: '角色管理',
        path: '/config/roleList',
      },
      name: '查看角色',
    },
    '/config/roleList': {
      component: dynamicWrapper(app, ['role'], () => import('../routes/Role/RoleList')),
      name: '角色管理',
    },
    '/bottomLine/refundList': {
      component: dynamicWrapper(app, ['refund'], () => import('../routes/Refund/RefundList')),
      name: '退费管理',
    },
    '/refund/refundAdd': {
      component: dynamicWrapper(app, ['refund'], () => import('../routes/Refund/RefundAdd')),
      bread: {
        name: '退费管理',
        path: '/bottomLine/refundList',
      },
      name: '添加退费',
    },
    '/refund/refundDel': {
      component: dynamicWrapper(app, ['refund'], () => import('../routes/Refund/RefundDel')),
      bread: {
        name: '退费管理',
        path: '/bottomLine/refundList',
      },
      name: '删除退费',
    },
    '/refund/returnAdd': {
      component: dynamicWrapper(app, ['refund'], () => import('../routes/Refund/RefundAdd')),
      bread: {
        name: '退费管理',
        path: '/bottomLine/refundList',
      },
      name: '添加退挽',
    },
    '/refund/returnDel': {
      component: dynamicWrapper(app, ['refund'], () => import('../routes/Refund/RefundDel')),
      bread: {
        name: '退费管理',
        path: '/bottomLine/refundList',
      },
      name: '删除退挽',
    },
    '/bottomLine/complaintList': {
      component: dynamicWrapper(app, ['blComplain'], () =>
        import('../routes/Complaint/ComplaintList')
      ),
      name: '投诉管理',
    },
    '/complaint/complaintAdd': {
      component: dynamicWrapper(app, ['blComplain'], () =>
        import('../routes/Complaint/ComplaintAdd')
      ),
      bread: {
        name: '投诉管理',
        path: '/bottomLine/complaintList',
      },
      name: '添加投诉',
    },
    '/complaint/complaintDel': {
      component: dynamicWrapper(app, ['blComplain'], () =>
        import('../routes/Complaint/ComplaintDel')
      ),
      bread: {
        name: '投诉管理',
        path: '/bottomLine/complaintList',
      },
      name: '删除投诉',
    },
    '/config/timeList': {
      component: dynamicWrapper(app, ['time'], () => import('../routes/TimeManage/TimeList')),
      name: '时间管理',
    },
    '/config/timeList/performance': {
      component: dynamicWrapper(app, ['time'], () => import('../routes/TimeManage/Performance')),
      name: '时间管理',
    },
    '/config/koSettings': {
      component: dynamicWrapper(app, ['time'], () => import('../routes/KOTimeManage/TimeList')),
      name: 'KO设置',
    },
    '/config/koSettings/koTimeManage': {
      component: dynamicWrapper(app, ['time'], () => import('../routes/KOTimeManage/Performance')),
      name: 'KO设置',
    },
    '/config/group': {
      component: dynamicWrapper(app, ['shortName'], () => import('../routes/ShotName/Group')),
      name: '小组短名称',
    },
    '/config/family': {
      component: dynamicWrapper(app, ['shortName'], () => import('../routes/ShotName/Family')),
      name: '家族短名称',
    },
    '/config/college': {
      component: dynamicWrapper(app, ['shortName'], () => import('../routes/ShotName/College')),
      name: '学院短名称',
    },
    '/config/complaintDoublesList': {
      component: dynamicWrapper(app, ['complaintDoubles'], () =>
        import('../routes/ComplaintDoubles/ComplaintDoublesList')
      ),
      name: '投诉倍数管理',
    },
    '/appeal/appealList': {
      component: dynamicWrapper(app, ['appeal'], () => import('../routes/Appeal/AppealList')),
      name: '申诉管理',
    },
    '/appeal/addAppeal': {
      component: dynamicWrapper(app, ['appeal'], () => import('../routes/Appeal/AddAppeal')),
      bread: {
        name: '申诉管理',
        path: '/appeal/appealList',
      },
      name: '添加申诉',
    },
    '/appeal/batchdelappeal': {
      component: dynamicWrapper(app, ['quality'], () => import('../routes/Appeal/BatchDelAppeal')),
      bread: {
        name: '申诉管理',
        path: '/appeal/appealList',
      },
      name: '批量申诉',
    },
    '/performance/familyCoefficient': {
      component: dynamicWrapper(app, ['coefficient'], () =>
        import('../routes/Coefficient/Family/index')
      ),
      name: '家族系数管理',
    },
    '/performance/familyCoefficient/list': {
      component: dynamicWrapper(app, ['coefficient'], () =>
        import('../routes/Coefficient/Family/List')
      ),
      name: '家族系数管理',
    },
    '/performance/familyCoefficient/check': {
      component: dynamicWrapper(app, ['coefficient'], () =>
        import('../routes/Coefficient/Family/Check')
      ),
      bread: {
        name: '家族系数管理',
        path: '/performance/familyCoefficient/list',
      },
      name: '查看绩效包',
    },
    '/performance/familyCoefficient/create': {
      component: dynamicWrapper(app, ['coefficient'], () =>
        import('../routes/Coefficient/Family/Create')
      ),
      bread: {
        name: '家族系数管理',
        path: '/performance/familyCoefficient/list',
      },
      name: '创建绩效包',
    },
    '/performance/familyCoefficient/editor': {
      component: dynamicWrapper(app, ['coefficient'], () =>
        import('../routes/Coefficient/Family/Editor')
      ),
      bread: {
        name: '家族系数管理',
        path: '/performance/familyCoefficient/list',
      },
      name: '编辑绩效包',
    },
    '/performance/groupCoefficient': {
      component: dynamicWrapper(app, ['coefficient'], () =>
        import('../routes/Coefficient/Group/index')
      ),
      name: '小组系数管理',
    },
    '/performance/groupCoefficient/list': {
      component: dynamicWrapper(app, ['coefficient'], () =>
        import('../routes/Coefficient/Group/List')
      ),
      name: '小组系数管理',
    },
    '/performance/groupCoefficient/check': {
      component: dynamicWrapper(app, ['coefficient'], () =>
        import('../routes/Coefficient/Group/Check')
      ),
      bread: {
        name: '小组系数管理',
        path: '/performance/groupCoefficient/list',
      },
      name: '查看绩效包',
    },
    '/performance/groupCoefficient/create': {
      component: dynamicWrapper(app, ['coefficient'], () =>
        import('../routes/Coefficient/Group/Create')
      ),
      bread: {
        name: '小组系数管理',
        path: '/performance/groupCoefficient/list',
      },
      name: '创建绩效包',
    },
    '/performance/groupCoefficient/editor': {
      component: dynamicWrapper(app, ['coefficient'], () =>
        import('../routes/Coefficient/Group/Editor')
      ),
      bread: {
        name: '小组系数管理',
        path: '/performance/groupCoefficient/list',
      },
      name: '编辑绩效包',
    },
    '/performance/collegePerformance': {
      component: dynamicWrapper(app, ['collegePerformance'], () =>
        import('../routes/Performance/CollegePerformance')
      ),
      name: '学院绩效金额',
    },
    '/performance/personalPerformance': {
      component: dynamicWrapper(app, ['collegePerformance'], () =>
        import('../routes/Performance/PersonalPerformance')
      ),
      bread: {
        name: '绩效管理',
        path: '/performance/collegePerformance',
      },
      name: '个人绩效金额',
    },
    '/performance/importPerformance': {
      component: dynamicWrapper(app, ['collegePerformance'], () =>
        import('../routes/Performance/ImportPerformance')
      ),
      bread: {
        name: '绩效管理',
        path: '/performance/collegePerformance',
      },
      name: '导入实发绩效',
    },
    '/performance/editPerformance': {
      component: dynamicWrapper(app, ['collegePerformance'], () =>
        import('../routes/Performance/EditPerformance')
      ),
      bread: {
        name: '绩效管理',
        path: '/performance/collegePerformance',
      },
      name: '编辑绩效',
    },
    '/bottomTable/bottomList': {
      component: dynamicWrapper(app, ['bottomTable'], () =>
        import('../routes/BottomTable/BottomList')
      ),
      name: '底表下载',
    },
    '/goodStudent/goodStudentList': {
      component: dynamicWrapper(app, ['goodStudent'], () =>
        import('../routes/GoodStudent/GoodStudentList')
      ),
      name: '好学生推荐',
    },
    '/goodStudent/goodStudentAdd': {
      component: dynamicWrapper(app, ['goodStudent'], () =>
        import('../routes/GoodStudent/GoodStudentAdd')
      ),
      bread: {
        name: '好学生推荐',
        path: '/goodStudent/goodStudentList',
      },
      name: '添加数据',
    },
    '/goodStudent/goodStudentDel': {
      component: dynamicWrapper(app, ['goodStudent'], () =>
        import('../routes/GoodStudent/GoodStudentDel')
      ),
      bread: {
        name: '好学生推荐',
        path: '/goodStudent/goodStudentList',
      },
      name: '删除数据',
    },
    // 优质帖High quality stickers
    '/highQuality/highQualityList': {
      component: dynamicWrapper(app, ['highQuality'], () =>
        import('../routes/HighQuality/HighQualityList')
      ),
      name: '优质帖',
    },
    '/highQuality/highQualityAdd': {
      component: dynamicWrapper(app, ['highQuality'], () =>
        import('../routes/HighQuality/HighQualityAdd')
      ),
      bread: {
        name: '优质帖',
        path: '/highQuality/highQualityList',
      },
      name: '添加数据',
    },
    '/highQuality/highQualityDel': {
      component: dynamicWrapper(app, ['highQuality'], () =>
        import('../routes/HighQuality/HighQualityDel')
      ),
      bread: {
        name: '优质帖',
        path: '/highQuality/highQualityList',
      },
      name: '删除数据',
    },
    '/exception': {
      component: dynamicWrapper(app, [], () => import('../layouts/ExceptionLayout')),
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
    '/exception/failUrl': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/failUrl')),
    },
    '/changePwd': {
      component: dynamicWrapper(app, [], () => import('../layouts/ChangePwd')),
    },
    '/changePwd/retrieve': {
      component: dynamicWrapper(app, ['password'], () =>
        import('../routes/Login/RetrievePassWord')
      ),
    },
    '/changePwd/emilRetrieve': {
      component: dynamicWrapper(app, ['password'], () =>
        import('../routes/Login/EmilRetrievePassWord')
      ),
    },
    '/changePwd/changePassword': {
      component: dynamicWrapper(app, ['password'], () => import('../routes/Login/ChangePassword')),
    },
    '/userLayout': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/userLayout/login': {
      component: dynamicWrapper(app, ['baseModels/login'], () => import('../routes/Login/Login')),
    },
    '/userLayout/loginOut': {
      component: dynamicWrapper(app, ['baseModels/login'], () => import('../routes/Login/Login')),
    },
    // // 业务技能认证
    //
    // // 审核管理
    '/skillCertification/auditList': {
      component: dynamicWrapper(app, ['audit'], () =>
        import('../routes/SkillCertification/AuditList')
      ),
      name: '审核管理',
    },
    '/skillCertification/auditApply': {
      component: dynamicWrapper(app, ['audit'], () =>
        import('../routes/SkillCertification/AuditApply')
      ),
      bread: {
        name: '审核管理',
        path: '/skillCertification/auditList',
      },
      name: '报名审核',
    },
    '/skillCertification/auditImport': {
      component: dynamicWrapper(app, ['audit', 'quality'], () =>
        import('../routes/SkillCertification/AuditImport')
      ),
      bread: {
        name: '审核管理',
        path: '/skillCertification/auditList',
      },
      name: '导入认证审核',
    },
    '/skillCertification/auditRecord': {
      component: dynamicWrapper(app, ['audit'], () =>
        import('../routes/SkillCertification/AuditRecord')
      ),
      bread: {
        name: '审核管理',
        path: '/skillCertification/auditList',
      },
      name: '审核记录',
    },
    '/skillCertification/checkCertifiedDetail': {
      component: dynamicWrapper(app, ['excellent'], () =>
        import('../routes/ExcellentCase/ExcellentDetail')
      ),
      bread: {
        name: '审核管理',
        path: '/skillCertification/auditList',
      },
      name: '认证详情',
    },
    // 认证管理
    '/skillCertification/certificationList': {
      component: dynamicWrapper(app, ['certification'], () =>
        import('../routes/SkillCertification/CertificationList')
      ),
      name: '认证管理',
    },
    '/skillCertification/certificationCreate': {
      component: dynamicWrapper(app, ['certification'], () =>
        import('../routes/SkillCertification/CertificationCreate')
      ),
      bread: {
        name: '认证管理',
        path: '/skillCertification/certificationList',
      },
      name: '创建认证项目',
    },
    '/skillCertification/certificationEdit': {
      component: dynamicWrapper(app, ['certification'], () =>
        import('../routes/SkillCertification/CertificationEdit')
      ),
      bread: {
        name: '认证管理',
        path: '/skillCertification/certificationList',
      },
      name: '编辑认证项目',
    },

    // ---- 申诉  学分调整 begin-----
    '/appeal/scoreAdjustList': {
      component: dynamicWrapper(app, ['scoreAdjust'], () =>
        import('../routes/Appeal/ScoreAdjustList')
      ),
      name: '学分调整',
    },
    '/appeal/scoreAdjustCreate': {
      component: dynamicWrapper(app, ['scoreAdjust'], () =>
        import('../routes/Appeal/ScoreAdjustCreate')
      ),
      bread: {
        name: '学分调整',
        path: '/appeal/scoreAdjustList',
      },
      name: '添加调整',
    },
    '/appeal/scoreAdjustEdit': {
      component: dynamicWrapper(app, ['scoreAdjust'], () =>
        import('../routes/Appeal/ScoreAdjustEdit')
      ),
      bread: {
        name: '学分调整',
        path: '/appeal/scoreAdjustList',
      },
      name: '编辑调整',
    },
    // ---- 申诉  学分调整 end -----
    '/excellent/excellentCaseList': {
      component: dynamicWrapper(app, ['excellent'], () =>
        import('../routes/ExcellentCase/ExcellentCase')
      ),
      name: '能力认证',
    },
    '/excellent/addExcellentCase': {
      component: dynamicWrapper(app, ['excellent'], () =>
        import('../routes/ExcellentCase/AddExcellentCase')
      ),
      bread: {
        name: '创新与优秀案例',
        path: '/excellent/excellentCaseList',
      },
      name: '添加申请',
    },
    '/excellent/checkCertifiedDetail': {
      component: dynamicWrapper(app, ['excellent'], () =>
        import('../routes/ExcellentCase/ExcellentDetail')
      ),
      bread: {
        name: '创新与优秀案例',
        path: '/excellent/excellentCaseList',
      },
      name: '认证详情',
    },
    // ---- 其他配置  报名通道文案设置 end -----
    '/otherConfig/officialSet': {
      component: dynamicWrapper(app, ['otherConfig'], () =>
        import('../routes/OtherConfig/OfficialSet')
      ),
      name: '文案设置',
    },
    // ---- 创收绩效 begin -----

    // ---
    // '/bottomOrder': {
    //   component: dynamicWrapper(app, ['goodStudent'], () =>
    //     import('../routes/BottomOrder/CreateIncome/List')
    //   ),
    //   name: '创收成单',
    // },
    '/bottomOrder/createIncome': {
      component: dynamicWrapper(app, ['bottomOrder_createIncome', 'stepsModel'], () =>
        import('../routes/BottomOrder/CreateIncome/List')
      ),
      name: '成单底表',
    },
    '/bottomOrder/createIncomeAdd': {
      component: dynamicWrapper(app, ['bottomOrder_createIncome', 'batch'], () =>
        import('../routes/BottomOrder/CreateIncome/Add')
      ),
      bread: {
        name: '创收成单',
        path: '/bottomOrder/createIncome',
      },
      name: '添加数据',
    },
    '/bottomOrder/createIncomeDel': {
      component: dynamicWrapper(app, ['bottomOrder_createIncome', 'batch'], () =>
        import('../routes/BottomOrder/CreateIncome/Del')
      ),
      bread: {
        name: '创收成单',
        path: '/bottomOrder/createIncome',
      },
      name: '删除数据',
    },
    // ---
    '/bottomOrder/koIncome': {
      component: dynamicWrapper(app, ['bottomOrder_koIncome'], () =>
        import('../routes/BottomOrder/KoIncome/List')
      ),
      name: 'KO成单',
    },
    '/bottomOrder/koIncomeAdd': {
      component: dynamicWrapper(app, ['bottomOrder_koIncome'], () =>
        import('../routes/BottomOrder/KoIncome/Add')
      ),
      bread: {
        name: 'KO成单',
        path: '/bottomOrder/koIncome',
      },
      name: '添加数据',
    },
    '/bottomOrder/koIncomeDel': {
      component: dynamicWrapper(app, ['bottomOrder_koIncome', 'quality'], () =>
        import('../routes/BottomOrder/KoIncome/Del')
      ),
      bread: {
        name: 'KO成单',
        path: '/bottomOrder/koIncome',
      },
      name: '删除数据',
    },

    // ---
    '/koDailyReport/family': {
      component: dynamicWrapper(app, ['koDailyReport_family'], () =>
        import('../routes/KoDailyReport/Family/List')
      ),
      name: '家族',
    },
    '/koDailyReport/familyAdd': {
      component: dynamicWrapper(app, ['koDailyReport_family'], () =>
        import('../routes/KoDailyReport/Family/Add')
      ),
      bread: {
        name: 'KO运营日报-家族',
        path: '/koDailyReport/family',
      },
      name: '添加数据',
    },
    // ---
    '/koDailyReport/group': {
      component: dynamicWrapper(app, ['koDailyReport_group'], () =>
        import('../routes/KoDailyReport/Group/List')
      ),
      name: '运营小组',
    },
    '/koDailyReport/groupAdd': {
      component: dynamicWrapper(app, ['koDailyReport_group'], () =>
        import('../routes/KoDailyReport/Group/Add')
      ),
      bread: {
        name: 'KO运营日报-小组',
        path: '/koDailyReport/group',
      },
      name: '添加数据',
    },
    // ---- 创收绩效 end -----
  };
  // Get name from ./menu.js or just set it in the router data.
  // const menuData = getFlatMenuData(getMenuData());
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    // const pathRegexp = pathToRegexp(path);
    // const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    // let menuItem = {};
    // If menuKey is not empty
    // if (menuKey) {
    //   menuItem = menuData[menuKey];
    // }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      // name: router.name || menuItem.name,
      // authority: router.authority || menuItem.authority,
      // hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
      // hideInMenu: router.hideInMenu || menuItem.hideInMenu,
    };
    routerData[path] = router;
  });
  return routerData;
};
