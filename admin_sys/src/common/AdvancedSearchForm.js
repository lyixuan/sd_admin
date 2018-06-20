import React, { Component } from 'react';
import { Form, Input, Cascader } from 'antd';

const FormItem = Form.Item;
const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
  },
];
class AdvancedSearchForm extends Component {
  state = {};
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="姓名">
          {getFieldDecorator('姓名', {
            rules: [{ required: true, message: '请输入姓名!', whitespace: true }],
          })(<Input style={{ width: 380 }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="邮箱">
          {getFieldDecorator('邮箱', {
            rules: [
              {
                type: 'email',
                message: '请输入合法邮箱!',
              },
              {
                required: true,
                message: '请输入合法邮箱!',
              },
            ],
          })(<Input style={{ width: 264 }} />)}
          <span style={{ width: 101 }}> @sunlands.com</span>
        </FormItem>
        <FormItem {...formItemLayout} label="角色">
          {getFieldDecorator('角色', {
            rules: [{ type: 'array', required: true, message: '请选择角色！' }],
          })(<Cascader options={residences} style={{ width: 380 }} />)}
        </FormItem>
        <FormItem {...tailFormItemLayout} />
      </Form>
    );
  }
}

export default AdvancedSearchForm;
