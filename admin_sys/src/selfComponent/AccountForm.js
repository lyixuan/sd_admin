import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Cascader, Button, message } from 'antd';
import common from '../routes/Common/common.css';

const FormItem = Form.Item;
@connect(({ account, loading }) => ({
  account,
  loading,
}))
class AccountForm extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.jumpFunction.getUrlParams();
    this.state = {
      roleList: !this.props.account.getRoleList.data.content
        ? []
        : this.props.account.getRoleList.data.content,
      name: !arrValue.name ? '' : arrValue.name,
      email: !arrValue.email ? '' : arrValue.email.substring(0, arrValue.email.indexOf('@')),
      role: !arrValue.role ? null : arrValue.role, // name.substring(0,name.indexOf("@"))
      from: !arrValue.from ? '' : arrValue.from,
      id: !arrValue.id ? '' : arrValue.id,
    };
  }

  componentDidMount() {
    // 为了提前获取角色列表数据。
    const getRoleListParams = {};
    this.props.dispatch({
      type: 'account/getRoleList',
      payload: { getRoleListParams },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const rname = values.rname[0];
        let newRoleId = 0;
        this.state.roleList.map(item => {
          if (item.name === rname) {
            newRoleId = item.id;
          }
          return 0;
        });
        if (this.state.from === 'edit') {
          const updateAccountParams = {
            name: values.name,
            mail: values.mail,
            roleId: newRoleId,
            id: Number(this.state.id),
          };
          console.log(updateAccountParams);
          this.props.dispatch({
            type: 'account/updateAccount',
            payload: { updateAccountParams },
          });
        } else {
          const addAccountParams = { name: values.name, mail: values.mail, roleId: newRoleId };
          console.log(addAccountParams);
          this.props.dispatch({
            type: 'account/addAccount',
            payload: { addAccountParams },
          });
        }
        console.log(
          !this.props.account.accountList.result ? [] : this.props.account.accountList.result.code
        );
        const aa = this.state.from === 'edit' ? '账号编辑成功！' : '账号创建成功！';
        message.success(aa);
        this.props.jumpFunction.setRouteUrlParams('/account/accountList', {});
      }
    });
  };
  roleListFun = val => {
    const residences = [];
    val.map(item =>
      residences.push({
        value: item.name,
        label: item.name,
      })
    );
    return residences;
  };

  resetContent = () => {
    this.props.form.resetFields(['name', 'email', 'role']);
    this.props.jumpFunction.setRouteUrlParams('/account/accountList', {});
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
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*姓名">
            {getFieldDecorator('name', {
              initialValue: this.state.name,
              rules: [
                // {validator:nameReg=()=>{},message:'您输入姓名不正确!'},自定义校验规则
                { required: true, message: '姓名为必填项，请填写!', whitespace: true },
                { min: 2, message: '姓名长度不得低于2!' },
                { mix: 20, message: '姓名长度不得高于20!' },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*邮箱">
            {getFieldDecorator('mail', {
              initialValue: this.state.email,
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
                { min: 3, message: '邮箱账号长度不得低于3!' },
                { mix: 50, message: '邮箱账号长度不得高于50!' },
              ],
            })(<Input style={{ width: 264 }} />)}
            <span style={{ width: 101 }}> @sunlands.com</span>
          </FormItem>
          <FormItem {...formItemLayout} label="*角色">
            {getFieldDecorator('rname', {
              initialValue: [this.state.role],
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

export default AccountForm;
