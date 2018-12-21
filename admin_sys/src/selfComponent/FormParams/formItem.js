import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

// function generator() {
// return WrappedComponent=>{
class BaseFormItem extends Component {
  static contextTypes = {
    form: PropTypes.object,
  };
  render() {
    console.log(this);
    const { getFieldDecorator } = this.context.form;
    return <FormItem>{getFieldDecorator('ceshi')(<Input />)}</FormItem>;
  }
  // }
}
// }
export default BaseFormItem;
