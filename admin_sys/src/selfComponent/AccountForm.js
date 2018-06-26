import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Cascader, Button } from 'antd';
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
      roleList:!this.props.account.getRoleList.content?[]:this.props.account.getRoleList.content,
      name: !arrValue.name ? '' : arrValue.name,
      email: !arrValue.email ? '' : arrValue.email.substring(0,arrValue.email.indexOf("@")),
      role: !arrValue.role ? '' : arrValue.role,// name.substring(0,name.indexOf("@"))
      from: !arrValue.from ? '' : arrValue.from,
      id: !arrValue.id?'':arrValue.id,
      roleId:!arrValue.roleId?'':arrValue.roleId,
    };
    console.log(this.state);
  }
  componentDidMount(){

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(this.state.roleList)
        console.log('Received values of form: ', values);
        const newmail =values.mail + "@sunlans.com"

        const rname = values.rname[0];
        let newRoleId = 0;
        this.state.roleList.map((item) =>{
          if(item.name === rname)
          {
            newRoleId = item.id
          }
          return 0;}
        )
        if (this.state.from === 'edit') {
          const updateAccountParams = { name: values.name, mail:newmail, roleId: newRoleId, id: this.state.id };
          console.log(updateAccountParams);
          this.props.dispatch({
            type: 'account/updateAccount',
            payload: { updateAccountParams },
          });
        } else {
          const addAccountParams = { name: values.name, mail: newmail, roleId: newRoleId };
          console.log(addAccountParams);
          this.props.dispatch({
            type: 'account/addAccount',
            payload: { addAccountParams },
          });
        }
        this.props.jumpFunction.setRouteUrlParams('/account/accountList', { });

      }
    });
  };
  roleListFun= (val) => {
    const residences = [];
    val.map((item) =>
      residences.push({
        value: item.name,
        label: item.name,
      })
    );
    return residences;

  }

  resetContent = () => {
    console.log(this.props);
    this.props.form.resetFields(['name', 'email', 'role']);
    this.props.jumpFunction.setRouteUrlParams('/account/accountList', { });
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
    const raleVal= !this.props.account.getRoleList?[]:this.props.account.getRoleList
    const residences=!raleVal.content?[]:this.roleListFun(raleVal.content)
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*姓名">
            {getFieldDecorator('name', {
              initialValue: this.state.name,
              rules: [
                // {validator:nameReg=()=>{},message:'您输入姓名不正确!'},自定义校验规则
                { min: 2, mix:20 , required: true, message: '您输入姓名不合法!', whitespace: true },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*邮箱">
            {getFieldDecorator('mail', {
              initialValue: this.state.email,
              rules: [
                { min: 3, mix:50 ,  required: true, message: '请输入邮箱不合法!', whitespace: true },
              ],
            })(<Input style={{ width: 264 }} />)}
            <span style={{ width: 101 }}> @sunlands.com</span>
          </FormItem>
          <FormItem {...formItemLayout} label="*角色">
            {getFieldDecorator('rname', {
              initialValue: [this.state.role],
              rules: [{ type: 'array', required: true, message: '请选择角色！' }],
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
