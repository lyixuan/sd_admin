import React, { Component } from 'react';
import { Form, Input, Cascader, Button } from 'antd';
import { formatEmail } from '../utils/email';
import common from '../routes/Common/common.css';

const FormItem = Form.Item;
class AccountForm extends Component {
  constructor(props) {
    super(props);
    const fromWhere = this.props.jumpFunction.getUrlParams();
    const roleValues = this.props.jumpFunction.account.getRoleList
    this.state = {
      roleList: !roleValues ? [] : !roleValues.data ? [] : roleValues.data.content,
      id: !fromWhere.id ? '' : fromWhere.id,
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
    const residences = !this.state.roleList ? [] : this.roleListFun(this.state.roleList);
    const arrValue = !this.props.jumpFunction.account.accountInfo?[]:!this.props.jumpFunction.account.accountInfo.response?[]:this.props.jumpFunction.account.accountInfo.response.data;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*姓名">
            {getFieldDecorator('name', {
              initialValue: !this.state.id?'':!arrValue.name?'':arrValue.name,
              rules: [
                // {validator:nameReg=()=>{},message:'您输入姓名不正确!'},自定义校验规则
                { required: true, message: '姓名为必填项，请填写!', whitespace: true },
                { min: 2,max: 20, message: '姓名长度在2-20字符之间!' },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*邮箱">
            {getFieldDecorator('mail', {
              initialValue: !this.state.id?'':!arrValue.mail?'':formatEmail(arrValue.mail),
              rules: [
                {
                  validator(rule, value, callback) {
                    const strExp = /^[A-Za-z0-9]+$/;
                    if (!strExp.test(value)) {
                      callback({ message: '请输入合法邮箱' });
                    }
                    callback();
                  },
                },
                { required: true, message: '邮箱为必填项，请填写!', whitespace: true },
                { min: 3,max: 50,required: true, message: '邮箱账号长度需要在3-50字符之间!' },
              ],
            })(<Input style={{ width: 264 }} disabled={!this.state.id ? false : 'disabled'} />)}
            <span style={{ width: 101 }}> @sunlands.com</span>
          </FormItem>
          <FormItem {...formItemLayout} label="*角色">
            {getFieldDecorator('rname', {
              initialValue: [!this.state.id?null:!arrValue.rname?null:arrValue.rname],
              rules: [
                {
                  validator(rule, value, callback) {
                    if (!value[0]) {
                      callback({ message: '角色为必填项，请选择！' });
                    }
                    callback();
                  },
                },
              ],
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

export default AccountForm;
