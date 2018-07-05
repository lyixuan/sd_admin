import React, { Component } from 'react';
import { Form, Input, Cascader, Button } from 'antd';
import { formatEmail } from '../utils/email';
import common from '../routes/Common/common.css';

const FormItem = Form.Item;
const userTypeList = [
  {
    value: '学院',
    label: '学院',
  },
  {
    value: '家族',
    label: '家族',
  },
  {
    value: '小组',
    label: '小组',
  },
  {
    value: '系统管理员',
    label: '系统管理员',
  },
  {
    value: '高级管理员',
    label: '高级管理员',
  },
  {
    value: '无底表权限',
    label: '无底表权限',
  },
];

class UserForm extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.jumpFunction.getUrlParams();
    const wechatValues = this.props.jumpFunction.user.wechatList
    const listOrgValues = this.props.jumpFunction.user.listOrg
    console.log(listOrgValues);
    this.state = {
      wechatList: !wechatValues.response.data.department ? [] : wechatValues.response.data.department,
      name: !arrValue.name ? null : arrValue.name,
      phone: !arrValue.phone ? null : arrValue.phone,
      email: !arrValue.email ? null : formatEmail(arrValue.email),
      userType: !arrValue.userType ? null : arrValue.userType,
      responseCom: !arrValue.responseCom ? null : arrValue.responseCom,
      // wechatDepartmentId: !arrValue.wechatDepartmentId ? null : arrValue.wechatDepartmentId,
      wechatDepartmentName: !arrValue.wechatDepartmentName ? null : arrValue.wechatDepartmentName,
    };

  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values)
      }
    });
  };

  roleListFun = val => {
    const residences = [];
    val.map((item, index) =>
      residences.push({
        value: item.name,
        label: item.name,
        key:index,
      })
    );
    return residences;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const residences = !this.state.wechatList ? [] : this.roleListFun(this.state.wechatList);
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
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*姓 名">
            {getFieldDecorator('name', {
              initialValue: this.state.name,
              rules: [{ min: 2, required: true, message: '您输入姓名不合法!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手 机">
            {getFieldDecorator('phone', {
              initialValue: this.state.phone,
              rules: [
                {
                  min: 11,
                  max: 11,
                  required: true,
                  message: '请输入手机号不合法!',
                  whitespace: true,
                },
              ],
            })(<Input style={{ width: 380 }} disabled={!this.state.phone?false:"disabled"} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*邮 箱">
            {getFieldDecorator('email', {
              initialValue: this.state.email,
              rules: [{ type: 'string', required: true, message: '请输入合法邮箱!' }],
            })(<Input style={{ width: 264 }} disabled={!this.state.email?false:"disabled"} />)}
            <span style={{ width: 101 }}> @sunlands.com</span>
          </FormItem>
          <FormItem {...formItemLayout} label="*级 别">
            {getFieldDecorator('userType', {
              initialValue: [this.state.userType],
              rules: [{ type: 'array', required: true, message: '请选择级别！' }],
            })(
              <Cascader options={userTypeList} style={{ width: 380 }} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="*负责单位">
            {getFieldDecorator('responseCom', {
              initialValue: [this.state.responseCom],
              rules: [{ type: 'array', required: true, message: '请选择单位！' }],
            })(<Cascader options={residences} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*微信部门">
            {getFieldDecorator('wechatDepartmentName', {
              initialValue: [this.state.wechatDepartmentName],
              rules: [{ type: 'array', required: true, message: '请选择微信部门！' }],
            })(<Cascader options={residences} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout} />
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={this.props.resetContent} type="primary" className={common.cancleButton}>
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

export default UserForm;
