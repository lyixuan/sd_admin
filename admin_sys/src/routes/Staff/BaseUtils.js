/* eslint-disable no-undef */
const FRONT_ROLE_TYPE_LIST = BI_Filter('FRONT_ROLE_TYPE_LIST');
export default {
  groupTypeObj: FRONT_ROLE_TYPE_LIST.filter(item => item.id !== 'admin'),
  returnGroupType: (groupType = '') => {
    return BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${groupType}`).name;
  },
  returnOrganization: (groupType = '') => {
    return BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${groupType}`).name;
  },
  removeMailSymbal: (mail = '') => {
    const newMail = mail || '';
    return newMail.split('@')[0];
  },
};
