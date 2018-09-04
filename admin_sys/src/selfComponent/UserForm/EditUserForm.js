import React, { Component } from 'react';
import { Form, Input, Button, message, Row, Col, Select, Spin ,DatePicker} from 'antd';
import { formatEmail } from '../../utils/email';
import common from '../../routes/Common/common.css';
// import { userTypeData } from '../../utils/dataDictionary';

const FormItem = Form.Item;
const { Option } = Select;
let responseComList = [];
let responseComListBackup = [];
let flag = '小组';
const dateFormat = 'YYYY-MM-DD';
// const RadioGroup = Radio.Group;

class EditUserForm extends Component {
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
    const aa = value;
    flag = aa;
    const responseValue = [];
    const userVal = this.props.jumpFunction.user;
    const listOrgValues = !userVal.listOrg.response
      ? []
      : !userVal.listOrg.response.data ? [] : userVal.listOrg.response.data;
    const newResponseComList = listOrgValues;
    if (flag === '家族') {
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
    } else if (flag === '学院') {
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
        // console.log('点击提交之后的values内容',values.userType,values.responseCom,values.responseCom[0],values.responseCom[1],values.responseCom[2])
        const rUserType = values.userType;
        const len = values.responseCom.length;
        if (rUserType === '小组' || rUserType === '无底表权限') {
          if (len !== 3) {
            message.error('负责单位请选择到对应小组');
          } else {
            this.props.handleSubmit(values);
          }
        } else if (rUserType === '家族') {
          if (len < 2) {
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const disabled = true;
    const userVal = this.props.jumpFunction.user;
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
    const aaa = this.props.jumpFunction.user.userList;
    const arrValue = !aaa
      ? []
      : !aaa.response
        ? []
        : !aaa.response.data ? [] : !aaa.response.data.content ? [] : aaa.response.data.content[0];

    // console.log(arr,str,arrValue.showNameIds)
    const { submit, wechatList, listOrg, userList } = this.props.jumpFunction;

    const formLayout = 'inline';
    return (
      <Spin spinning={wechatList || listOrg || userList}>
        <Form layout={formLayout} onSubmit={this.handleSubmit}>
          <Row >
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem  label="*姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名">
                {getFieldDecorator('name', {
                  initialValue:!arrValue.name ? '' : arrValue.name,
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
              <FormItem  label="*性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别">
                {getFieldDecorator('sex', {
                  initialValue:!arrValue.sex ? '' : arrValue.sex,
                  rules: [{ required: true, message: '性别为必填项，请选择!', whitespace: true }],
                })(
                  <Select style={{ width: 280 }}>
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row  style={{marginTop: '20px'}}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem  label="手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机">
                {getFieldDecorator('phone', {
                  initialValue:!arrValue.mobile ? '' : arrValue.mobile,
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
                })(<Input style={{ width: 280 }} disabled={!this.state.phone ? false : disabled} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem  label="*邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱">
                {getFieldDecorator('email', {
                  initialValue:!arrValue.mail ? '' : formatEmail(arrValue.mail),
                  rules: [{ required: true, message: '邮箱为必填项，长度需要在3-50字符之间，请填写!', whitespace: true }],
                })(
                  <div>
                    <Input style={{ width: '175px' }} disabled={!this.state.id ? false : disabled} />
                    <span style={{ width: '101px' }}> @sunlands.com</span>
                  </div>

                )}
              </FormItem>
            </Col>
          </Row>
          <Row  style={{marginTop: '20px'}}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }} >
              <FormItem  label="*身份证号" >
                {getFieldDecorator('idCard', {
                  initialValue:!arrValue.idCard ? '' : arrValue.idCard,
                  rules: [{ required: true, message: '身份证号为必填项，请填写!', whitespace: true }],
                })(<Input style={{ width: 280 }}  />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem  label="*入职日期">
                {getFieldDecorator('employDate', {
                  rules: [],
                })(
                  <DatePicker
                    format={dateFormat}
                    style={{ width: 280, height: 32 }}
                  /> )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{marginTop: '20px'}}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*微信部门">
                {getFieldDecorator('wechatDepartmentName', {
                  initialValue:!arrValue.wechatDepartmentName ? '' : arrValue.wechatDepartmentName,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '请选择权微信部门！' });
                        }
                        callback();
                      },
                    },
                  ],
                })(residences)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
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

        <Button
          style={{marginTop:'36px'}}
          type="primary"
          className={common.submitButton}
          loading={submit}
        >
          添加岗位
        </Button>
      </Spin>
    );
  }
}

export default EditUserForm;
