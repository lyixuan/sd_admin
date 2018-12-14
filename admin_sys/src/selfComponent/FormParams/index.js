import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { TIME_LOCAL } from '../../utils/constants';

import { formList } from './test';

moment.locale(TIME_LOCAL);
const FormItem = Form.Item;

/*
*@params  formList  array
*/
class FormPrams extends Component {
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
  };
  static defaultProps = {
    className: '',
    onSubmit: () => {},
  };
  static childContextTypes = {
    form: PropTypes.object,
  };
  getChildContext() {
    return {
      form: this.props.form,
    };
  }
  reset = () => {
    console.log('reset');
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(err, values);
      this.props.onSubmit(err, values);
    });
  };
  initFormList = () => {
    // const formList=Array.isArray(this.props.formList)?this.props.formList:[];
    return formList.map(item => {
      return this.renderItem(item);
    });
  };
  renderChildren = () => {
    const { children } = this.props;
    const otherChildren = [];
    React.Children.forEach(children, item => {
      if (!item) {
        return;
      } else {
        otherChildren.push(item);
      }
    });
    return otherChildren;
  };
  renderItem = item => {
    const { getFieldDecorator } = this.props.form;
    const { lable, key, placeholder, initialValue, ...others } = item;
    return (
      <FormItem label={item.lable} key={item.key} {...others}>
        {getFieldDecorator(key, { initialValue })(<Input placeholder={placeholder} />)}
      </FormItem>
    );
  };
  render() {
    const children = this.renderChildren();
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        {[...children]}
        {this.initFormList()}
        <FormItem>
          <Button type="primary" htmlType="submit">
            查询
          </Button>

          <Button onClick={this.reset}>重置</Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(FormPrams);
