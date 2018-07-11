import React, { Component } from 'react';
import { Form, Input, Cascader, Button } from 'antd';
import { formatEmail } from '../utils/email';
import common from '../routes/Common/common.css';
// import { levelDataReset } from '../utils/dataDictionary';

const FormItem = Form.Item;

let responseComList = [];
let responseComListBackup = [];
let flag = '小组';

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
    const wechatValues = this.props.jumpFunction.user.wechatList.response.data;
    const listOrgValues = this.props.jumpFunction.user.listOrg.response.data;
    this.state = {
      wechatList: !wechatValues.department ? [] : wechatValues.department,
      listOrgLiost: listOrgValues,
      name: !arrValue.name ? null : arrValue.name,
      phone: !arrValue.phone ? null : arrValue.phone,
      email: !arrValue.email ? null : formatEmail(arrValue.email),
      userType: !arrValue.userType ? null : arrValue.userType,
      responseCom: !arrValue.responseCom ? null : arrValue.responseCom,
      wechatDepartmentName: !arrValue.wechatDepartmentName ? null : arrValue.wechatDepartmentName,
    };
  }
  componentDidMount() {
    responseComListBackup = !this.state.listOrgLiost
      ? []
      : this.fullListFun(this.state.listOrgLiost);
    responseComList = this.responseComListFun();
    flag = this.state.userType;
  }

  fullListFun = val => {
    const value = [];
    val.map(item => {
      const firstChldren = [];
      const chldren1 = item.sub;
      chldren1.map(obj => {
        const chldren2 = obj.sub;
        const secondChldren = [];
        chldren2.map(list => {
          secondChldren.push({
            value: list.id,
            label: list.name,
            level: list.level,
          });
          return 0;
        });
        firstChldren.push({
          value: obj.id,
          label: obj.name,
          level: obj.level,
          children: secondChldren,
        });
        return 0;
      });
      value.push({
        value: item.id,
        label: item.name,
        level: item.level,
        children: firstChldren,
      });
      return 0;
    });
    return value;
  };

  responseComListFun = () => {
    const responseValue = [];
    const newResponseComList = this.state.listOrgLiost;
    const levelValue = !this.state.userType ? '小组' : this.state.userType;
    flag = levelValue;
    if (levelValue === '家族') {
      console.log('进入家族的分支');
      newResponseComList.map(item => {
        const firstChldren = [];
        const chldren1 = item.sub;
        chldren1.map(value => {
          firstChldren.push({
            value: value.id,
            label: value.name,
            level: value.level,
          });
          return 0;
        });
        responseValue.push({
          value: item.id,
          label: item.name,
          level: item.level,
          children: firstChldren,
        });
        return 0;
      });
    }
    if (levelValue === '学院') {
      console.log('进入学院的分支');
      newResponseComList.map(item => {
        responseValue.push({
          value: item.id,
          label: item.name,
          level: item.level,
        });
        return 0;
      });
    }
    return responseValue.length === 0 ? responseComListBackup : responseValue;
  };

  handleSelectChange = value => {
    const aa = value[0];
    flag = aa;
    console.log(flag);
    const responseValue = [];
    const newResponseComList = this.state.listOrgLiost;
    if (value[0] === '家族') {
      newResponseComList.map(item => {
        const firstChldren = [];
        const chldren1 = item.sub;
        chldren1.map(val => {
          firstChldren.push({
            value: val.id,
            label: val.name,
            level: val.level,
          });
          return 0;
        });
        responseValue.push({
          value: item.id,
          label: item.name,
          level: item.level,
          children: firstChldren,
        });
        return 0;
      });
    } else if (value[0] === '学院') {
      newResponseComList.map(item => {
        responseValue.push({
          value: item.id,
          label: item.name,
          level: item.level,
        });
        return 0;
      });
    }
    responseComList = responseValue.length === 0 ? responseComListBackup : responseValue;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };

  roleListFun = val => {
    const residences = [];
    val.map((item, index) =>
      residences.push({
        value: item.name,
        label: item.name,
        key: index,
      })
    );
    return residences;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const residences = !this.state.wechatList ? [] : this.roleListFun(this.state.wechatList);
    const disabled = true;
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
                  validator(rule, value, callback) {
                    const reg = /^0?1\d{10}$/; // /^0?1[3|4|5|8|7][0-9]\d{8}$/
                    if (!reg.test(value)) {
                      callback({ message: '手机号是以1开头的11位数字组成' });
                    }
                    callback();
                  },
                },
              ],
            })(<Input style={{ width: 380 }} disabled={!this.state.phone ? false : disabled} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*邮 箱">
            {getFieldDecorator('email', {
              initialValue: this.state.email,
              rules: [{ type: 'string', required: true, message: '请输入合法邮箱!' }],
            })(<Input style={{ width: 264 }} disabled={!this.state.email ? false : disabled} />)}
            <span style={{ width: 101 }}> @sunlands.com</span>
          </FormItem>
          <FormItem {...formItemLayout} label="*级 别">
            {getFieldDecorator('userType', {
              initialValue: [this.state.userType],
              rules: [
                {
                  validator(rule, value, callback) {
                    if (!value[0]) {
                      callback({ message: '请选择权级别！' });
                    }
                    callback();
                  },
                },
              ],
            })(
              <Cascader
                options={userTypeList}
                onChange={this.handleSelectChange}
                style={{ width: 380 }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="*负责单位">
            {getFieldDecorator('responseCom', {
              initialValue: [this.state.responseCom],
              rules: [
                {
                  validator(rule, value, callback) {
                    console.log('规则校验', flag, value[0]);
                    if (typeof value[0] === 'string' || !value[0]) {
                      if (flag === '系统管理员' || flag === '高级管理员') {
                        callback();
                      } else {
                        callback({ message: '请选择负责单位！' });
                      }
                    }
                    callback();
                  },
                },
              ],
            })(
              <Cascader
                options={responseComList}
                style={{ width: 380 }}
                disabled={flag === '系统管理员' || flag === '高级管理员' ? 'disabled' : false}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="*微信部门">
            {getFieldDecorator('wechatDepartmentName', {
              initialValue: [this.state.wechatDepartmentName],
              rules: [
                {
                  validator(rule, value, callback) {
                    if (!value[0]) {
                      callback({ message: '请选择权微信部门！' });
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
              <Button
                onClick={this.props.resetContent}
                type="primary"
                className={common.cancleButton}
              >
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
