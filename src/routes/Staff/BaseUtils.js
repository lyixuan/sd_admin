const FRONT_ROLE_TYPE_LIST = window.BI_Filter('FRONT_ROLE_TYPE_LIST');
export default {
  groupTypeObj: FRONT_ROLE_TYPE_LIST.filter(item => item.id !== 'admin'),
  returnGroupType: (groupType = '') => {
    return window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${groupType}`).name;
  },
  returnOrganization: (groupType = '') => {
    return window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${groupType}`).name;
  },
  removeMailSymbal: (mail = '') => {
    const newMail = mail || '';
    return newMail.split('@')[0];
  },
};
