/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  Form,
  Input,
  Cascader,
  Checkbox,
  Button,
  Row,
  Col,
  Select,
  Spin,
  DatePicker,
  Radio,
} from 'antd';
import common from '../../routes/Common/common.css';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
let responseComList = [];
let responseComListBackup = [];
let firstJoinDate = null;
let flag = 'class';
const dateFormat = 'YYYY-MM-DD';
const RadioGroup = Radio.Group;

class CreateUserForm extends Component {
  constructor(props) {
    super(props);
    const userVal = this.props.jumpFunction.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    this.state = {
      listOrgLiost: listOrgValues || [],
      plainOptions: BI_Filter('VISIT_RIGHT_LIST|id->value,name->label'),
      defaultCheckedList: [],
    };
  }
  componentDidMount() {
    responseComListBackup = !this.state.listOrgLiost
      ? []
      : this.fullListFun(this.state.listOrgLiost);
  }

  // 组件卸载时清除声明的变量
  componentWillUnmount() {
    flag = null;
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

  // viewChange = value => {
  //   console.log('view修改内容', value);
  // };

  handleSelectChange = value => {
    const aa = value;
    flag = aa;
    const responseValue = [];
    const userVal = this.props.jumpFunction.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    const newResponseComList = listOrgValues;

    this.props.form.setFieldsValue({
      privilege: 0,
      responseCom: [],
    });
    // if(flag === 'admin' ||flag === 'others'||flag === 'boss'){
    // this.props.form.setFieldsValue({
    //   responseCom:[],
    // });}

    if (flag === 'family') {
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
    } else if (
      flag === 'college' ||
      flag === 'csmanager' ||
      flag === 'cssupervisor' ||
      flag === 'csleader' ||
      flag === 'csofficer'
    ) {
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

  joinDateFun = (dates, dateStrings) => {
    const aa = dateStrings;
    firstJoinDate = aa;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values, firstJoinDate);
      }
    });
  };

  roleListFun = (val = []) => {
    const list = !val ? [] : val;
    return (
      <Select style={{ width: 280 }}>
        {list.map(item => (
          <Option value={item.name} key={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    );
  };
  roleNameList = (val = []) => {
    const list = !val ? [] : val;
    return (
      <Select style={{ width: 280 }}>
        {list.map(item => (
          <Option value={item.id} key={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const disabled = true;
    const userVal = this.props.jumpFunction.user;
    const wechatValues = !userVal.wechatList.response
      ? []
      : !userVal.wechatList.response.data ? [] : userVal.wechatList.response.data.department;
    const residences = !wechatValues ? [] : this.roleListFun(wechatValues);

    const { dateArea = [] } = userVal.getUserRoleList;
    const roleNameList = this.roleNameList(dateArea);

    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    responseComListBackup = !listOrgValues ? [] : this.fullListFun(listOrgValues);
    responseComList =
      !responseComList || responseComList.length === 0 ? responseComListBackup : responseComList;
    const { submit, wechatList, listOrg, roleOrg } = this.props.jumpFunction;
    const formLayout = 'inline';
    return (
      <Spin spinning={wechatList || listOrg || roleOrg}>
        <Form layout={formLayout} onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名">
                {getFieldDecorator('name', {
                  initialValue: null,
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
                })(<Input style={{ width: 280 }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别">
                {getFieldDecorator('sex', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '性别为必填项，请选择!' });
                        }
                        callback();
                      },
                    },
                  ],
                })(
                  <Select style={{ width: 280 }}>
                    <Option value={1}>男</Option>
                    <Option value={2}>女</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机">
                {getFieldDecorator('mobile', {
                  initialValue: null,
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
                })(
                  <Input style={{ width: 280 }} disabled={!this.state.phone ? false : disabled} />
                )}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱">
                {getFieldDecorator('mail', {
                  initialValue: null,
                  rules: [],
                })(
                  <div>
                    <Input
                      style={{ width: '175px' }}
                      disabled={!this.state.id ? false : disabled}
                    />
                    <span style={{ width: '101px' }}> @sunlands.com</span>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*身份证号">
                {getFieldDecorator('idCard', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; // 身份证校验规则
                        if (!value) {
                          callback({ message: '身份证号为必填项，请填写!' });
                        } else if (reg.test(value) === false) {
                          callback({ message: '身份证号输入不合法!' });
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(<Input style={{ width: 280 }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;归属地">
                {getFieldDecorator('city', {
                  initialValue: null,
                })(
                  <Select style={{ width: 280 }}>
                    <Option value="北京">北京</Option>
                    <Option value="广州">广州</Option>
                    <Option value="武汉">武汉</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*入职日期">
                {getFieldDecorator('joinDate', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '入职日期为必填项，请选择!' });
                        }
                        callback();
                      },
                    },
                  ],
                })(
                  <DatePicker
                    format={dateFormat}
                    style={{ width: 280, height: 32 }}
                    onChange={this.joinDateFun}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*微信部门">
                {getFieldDecorator('wechatDepartmentName', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '请选择微信部门！' });
                        }
                        callback();
                      },
                    },
                  ],
                })(residences)}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ marginTop: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*前端角色">
                {getFieldDecorator('userType', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '请选择前端角色！' });
                        }
                        callback();
                      },
                    },
                  ],
                })(
                  <Select style={{ width: 280 }} onChange={this.handleSelectChange}>
                    {BI_Filter('FRONT_ROLE_TYPE_LIST').map(v => (
                      <Option value={v.id} key={v.id}>
                        {v.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*组&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;织">
                {getFieldDecorator('responseCom', {
                  initialValue: [],
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (typeof value[0] === 'string' || !value[0]) {
                          if (flag === 'admin' || flag === 'boss' || flag === 'others') {
                            callback();
                          } else {
                            callback({ message: '请选择组织！' });
                          }
                        }
                        callback();
                      },
                    },
                  ],
                })(
                  <Cascader
                    options={responseComList}
                    style={{ width: 280 }}
                    disabled={
                      flag === 'admin' || flag === 'boss' || flag === 'others' ? disabled : false
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ marginTop: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*后端角色">
                {getFieldDecorator('roleId', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '请选择后端角色！' });
                        }
                        callback();
                      },
                    },
                  ],
                })(roleNameList)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*绩效权限">
                {getFieldDecorator('privilege', {
                  initialValue: 0,
                  rules: [],
                })(
                  <RadioGroup
                    style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}
                  >
                    <Radio
                      name="privilege"
                      disabled={flag === 'admin' ? disabled : false}
                      value={1}
                    >
                      是
                    </Radio>
                    <Radio name="privilege" value={0}>
                      否
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={10} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="访问权限">
                {getFieldDecorator('view', {
                  initialValue: this.state.defaultCheckedList,
                  rules: [],
                })(
                  <CheckboxGroup
                    style={{ color: 'rgba(0, 0, 0, 0.85)', width: '340px', textAlign: 'left' }}
                    options={this.state.plainOptions}
                    className={common.checkboxGroup}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ marginTop: '20px' }}>
            <Col span={6} offset={17} style={{ textAlign: 'right' }}>
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
      </Spin>
    );
  }
}

export default CreateUserForm;
