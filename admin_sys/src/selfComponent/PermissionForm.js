import React, { Component } from 'react';
import { Form, Input, Cascader, Button } from 'antd';
import common from '../routes/Common/common.css';

const FormItem = Form.Item;
const residences = [
  {
    value: '一级页面',
    label: 'Zhejiang',
  },
  {
    value: '二级页面',
    label: 'Jiangsu',
  },
  {
    value: '页面功能',
    label: 'function',
  },
];
class PermissionForm extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.jumpFunction.getUrlParams();
    this.state = {
      permissionName: !arrValue.permissionName ? '' : arrValue.permissionName,
      permissionType: !arrValue.permissionType ? '' : arrValue.permissionType,
      permissionRoute: !arrValue.permissionRoute ? '' : arrValue.permissionRoute,
      upId: !arrValue.upId ? '' : arrValue.upId,
      status: !arrValue.status ? '' : arrValue.status,
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
    this.props.jumpFunction.setRouteUrlParams('/permission/permissionList', {
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
          <FormItem {...formItemLayout} label="*权限名称">
            {getFieldDecorator('name', {
              initialValue: this.state.permissionName,
              rules: [
                { min: 2, required: true, message: '您输入权限名称不合法!', whitespace: true },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限类型">
            {getFieldDecorator('type', {
              initialValue: [this.state.permissionType],
              rules: [{ type: 'array', required: true, message: '权限类型！' }],
            })(<Cascader options={residences} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限路由">
            {getFieldDecorator('route', {
              initialValue: this.state.permissionRoute,
              rules: [{ required: true, message: '请输入权限路由!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="上级权限">
            {getFieldDecorator('role', {
              initialValue: [this.state.upId],
            })(<Cascader options={residences} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="一级页面图标">
            {getFieldDecorator('phone', {})(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限排序">
            {getFieldDecorator('random', {
              initialValue: this.state.status,
              rules: [{ required: true, message: '请输入权限排序!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout} />
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={this.resetContent} type="primary" className={common.cancleButton}>
                取消
              </Button>
              <Button htmlType="submit" type="primary" className={common.submitButton}>
                提交
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default PermissionForm;
