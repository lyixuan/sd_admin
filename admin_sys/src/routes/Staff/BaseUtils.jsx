import { Form } from 'antd';

export class BaseUtils {
  constructor() {
    this.groupTypeObj = {
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
}
