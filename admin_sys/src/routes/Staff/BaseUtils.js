const FRONT_ROLE_TYPE_LIST = window.Filter('FRONT_ROLE_TYPE_LIST');
export default {
  groupTypeObj: FRONT_ROLE_TYPE_LIST.filter(item => item.id !== 'admin'),
  returnGroupType: (groupType = '') => {
    return window.Filter(`FRONT_ROLE_TYPE_LIST|id:${groupType}`);
  },
  returnOrganization: (groupType = '') => {
    return window.Filter(`FRONT_ROLE_TYPE_LIST|id:${groupType}`);
  },
  removeMailSymbal: (mail = '') => {
    const newMail = mail || '';
    return newMail.split('@')[0];
  },
};
