import React, { Component } from 'react';
import { Form, Input, Cascader, Button, message, Row, Col } from 'antd';
import { formatEmail } from '../utils/email';
import common from '../routes/Common/common.css';
import { userTypeData } from '../utils/dataDictionary';

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
    const userVal = this.props.jumpFunction.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    this.state = {
      listOrgLiost: listOrgValues || [],
      id: !arrValue.id ? '' : arrValue.id,
      userType: !arrValue.userType ? '' : arrValue.userType,
    };
  }
  componentDidMount() {
    flag = this.state.userType;
    responseComListBackup = !this.state.listOrgLiost
      ? []
      : this.fullListFun(this.state.listOrgLiost);
    responseComList = this.responseComListFun();
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
    const userVal = this.props.jumpFunction.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    const newResponseComList = listOrgValues;
    const levelValue = !this.state.userType ? '小组' : this.state.userType;
    flag = levelValue;
    if (flag === '家族') {
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
    if (flag === '学院') {
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
    const responseValue = [];
    const userVal = this.props.jumpFunction.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    const newResponseComList = listOrgValues;
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
        const rUserType = values.userType[0];
        const len = values.responseCom.length;
        if (rUserType === '小组'||rUserType === '无底表权限') {
          if (len !== 3) {
            message.error('负责单位请选择到对应小组');
          } else {
            this.props.handleSubmit(values);
          }
        } else if (rUserType === '家族') {
          if (len !== 2) {
            message.error('负责单位请选择到对应家族');
          } else {
            this.props.handleSubmit(values);
          }
        } else {
          this.props.handleSubmit(values);
        }
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
    const disabled = true;
    const userVal = this.props.jumpFunction.user;
    const { submit } = this.props.jumpFunction;
    const wechatValues = !userVal.wechatList.response
      ? []
      : !userVal.wechatList.response.data ? [] : userVal.wechatList.response.data.department;
    const residences = !wechatValues ? [] : this.roleListFun(wechatValues);
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    responseComListBackup = !listOrgValues ? [] : this.fullListFun(listOrgValues);
    responseComList =
      !responseComList || responseComList.length === 0
        ? this.responseComListFun()
        : responseComList;
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
    const aaa = this.props.jumpFunction.user.userList;
    const arrValue = !aaa
      ? []
      : !aaa.response
        ? []
        : !aaa.response.data ? [] : !aaa.response.data.content ? [] : aaa.response.data.content[0];
    const str = !arrValue?'':arrValue.showNameIds?'':arrValue.showNameIds;
    const strs = !str ? [] : str.split(',');
    const arr = !strs
      ? []
      : strs.map(el => {
          return Number(el);
        });
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*姓 名">
            {getFieldDecorator('name', {
              initialValue: !this.state.id ? '' : !arrValue.name ? '' : arrValue.name,
              rules: [
                {
                  validator(rule, value, callback) {
                    // const reg = !value ? '' : value.replace(/(^\s*)|(\s*$)/g, '');// 去除字符串前后的空格
                    const reg = !value ? '' : value.replace(/\s*/g, ''); // 去除字符串中全局空格
                    if (!reg) {
                      callback({ message: '姓名为必填项，请填写!' });
                    } else if (reg.length < 2 || reg.length > 20) {
                      callback({ message: '姓名在2-20个字符之间，请填写!' });
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手 机">
            {getFieldDecorator('phone', {
              initialValue: !this.state.id ? '' : !arrValue.mobile ? '' : arrValue.mobile,
              rules: [
                {
                  validator(rule, value, callback) {
                    const reg = /^0?1\d{10}$/; // /^0?1[3|4|5|8|7][0-9]\d{8}$/
                    if (!reg.test(value) && value) {
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
              initialValue: !this.state.id
                ? ''
                : !arrValue.entUserId ? '' : formatEmail(arrValue.entUserId),
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
                { min: 3, max: 50, required: true, message: '邮箱账号长度需要在3-50字符之间!' },
              ],
            })(<Input style={{ width: 264 }} disabled={!this.state.id ? false : disabled} />)}
            <span style={{ width: 101,marginLeft:'6px' }}> @sunlands.com</span>
          </FormItem>
          <FormItem {...formItemLayout} label="*级 别">
            {getFieldDecorator('userType', {
              initialValue: [
                !this.state.id ? '' : !arrValue.userType ? '' : userTypeData[arrValue.userType],
              ],
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
              initialValue: !this.state.id ? [] : arr,
              rules: [
                {
                  validator(rule, value, callback) {
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
                disabled={flag === '系统管理员' || flag === '高级管理员' ? disabled : false}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="*微信部门">
            {getFieldDecorator('wechatDepartmentName', {
              initialValue: [
                !this.state.id
                  ? ''
                  : !arrValue.wechatDepartmentName ? '' : arrValue.wechatDepartmentName,
              ],
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
          <Row>
            <Col span={6} offset={7}>
              <FormItem>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={this.props.resetContent}
                    type="primary"
                    className={common.cancleButton}
                  >
                    取消
                  </Button>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className={common.submitButton}
                    loading={submit}
                  >
                    提交
                  </Button>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default UserForm;
