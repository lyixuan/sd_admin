import { Form } from 'antd';

export class BaseUtils {
  constructor() {
    this.groupTypeObj = {
      boss: '管理层',
      // admin: '管理员',
      college: '院长或副院长',
      family: '家族长',
      group: '运营长',
      class: '班主任',
      others: '无绩效岗位',
    };
    this.FormItem = Form.Item;
  }
  returnGroupType = (groupType = '') => {
    return this.groupTypeObj[groupType];
  };
  returnOrganization = (groupType = '') => {
    let returnType = null;
    switch (groupType) {
      case 'boss':
        returnType = '管理层';
        break;
      case 'admin':
        returnType = '管理员';
        break;
      case 'others':
        returnType = '无绩效岗位';
        break;
      default:
        returnType = null;
    }
    return returnType;
  };
  removeMailSymbal = (mail = '') => {
    const newMail = mail || '';
    return newMail.split('@')[0];
  };
}
