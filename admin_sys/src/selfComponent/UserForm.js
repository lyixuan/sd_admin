import React, { Component } from 'react';
import { Form, Input, Cascader, Button } from 'antd';
import common from '../routes/Common/common.css';

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
class UserForm extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.jumpFunction.getUrlParams();
    this.state = {
      name: !arrValue.name ? '' : arrValue.name,
      phone: !arrValue.phone ? '' : arrValue.phone,
      email: !arrValue.email ? '' : arrValue.email,
      role: !arrValue.role ? '' : arrValue.role,
      responseCom: !arrValue.responseCom ? '' : arrValue.responseCom,
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  resetContent = () => {
    console.log(this.props);
    this.props.form.resetFields(['name', 'email', 'role']);
    this.props.jumpFunction.setRouteUrlParams('/user/userList', {
      a: 2,
      b: 3,
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
      <div>
        {/*
        <p style={{marginLeft:32,fontSize:24}}>账户信息</p>
        */}
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*姓名">
            {getFieldDecorator('name', {
              initialValue: this.state.name,
              rules: [{ required: true, message: '请输入姓名!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手机">
            {getFieldDecorator('phone', {
              initialValue: this.state.phone,
              rules: [{ required: true, message: '请输入手机号!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*邮箱">
            {getFieldDecorator('string', {
              initialValue: this.state.email,
              rules: [{ type: 'string', message: '请输入合法邮箱!' }],
            })(<Input style={{ width: 264 }} />)}
            <span style={{ width: 101 }}> @sunlands.com</span>
          </FormItem>
          <FormItem {...formItemLayout} label="*级别">
            {getFieldDecorator('role', {
              initialValue: [this.state.role],
              rules: [{ type: 'array', required: true, message: '请选择级别！' }],
            })(<Cascader options={residences} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*负责单位">
            {getFieldDecorator('responseCom', {
              initialValue: [this.state.responseCom],
              rules: [{ type: 'array', required: true, message: '请选择单位！' }],
            })(<Cascader options={residences} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout} />
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={this.resetContent} type="primary" className={common.cancleButton}>
                取消
              </Button>
              <Button onSubmit={this.handleSubmit} type="primary" className={common.submitButton}>
                提交
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default UserForm;
