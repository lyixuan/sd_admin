import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Select, Spin, DatePicker ,message} from 'antd';
import moment from 'moment';
import { formatEmail } from '../../utils/email';
import common from '../../routes/Common/common.css';
import { formatDateNew } from '../../utils/FormatDate';

const FormItem = Form.Item;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
let firstJoinDate = null;

class EditUserForm extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.jumpFunction.getUrlParams();
    this.state = {
      mail: !arrValue ? '' : !arrValue.mail ? '' : arrValue.mail,
    };
  }
  componentDidMount() {}

  joinDateFun = (dates, dateStrings) => {
    const aa = dateStrings;
    firstJoinDate = aa;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(!firstJoinDate){
          message.error("请选择入职日期")
        }else{
          this.props.handleSubmit(values,firstJoinDate);
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
    const formLayout = 'inline';
    const disabled = true;
    const userVal = this.props.jumpFunction.user;
    const wechatValues = !userVal.wechatList.response
      ? []
      : !userVal.wechatList.response.data ? [] : userVal.wechatList.response.data.department;
    const residences = !wechatValues ? [] : this.roleListFun(wechatValues);

    const aaa = !this.props.jumpFunction.user.getUserlistData
      ? null
      : this.props.jumpFunction.user.getUserlistData;

    const arrValue = !aaa
      ? null
      : !aaa.data ? null : !aaa.data.generalAttribute ? null : aaa.data.generalAttribute;
    const { submit, wechatList, userList } = this.props.jumpFunction;
    return (
      <Spin spinning={wechatList || userList}>
        <Form layout={formLayout} onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 名">
                {getFieldDecorator('name', {
                  initialValue: !arrValue ? '' : !arrValue.name ? '' : arrValue.name,
                  rules: [
                    {
                      validator(rule, value, callback) {
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
                  initialValue: !arrValue ? '' : !arrValue.sex ? '' : arrValue.sex,
                  rules: [{
                    validator(rule, value, callback) {
                      if(!value){
                        callback({ message: '性别为必填项，请选择!' });
                      }
                      callback();
                    },
                  }],
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
              <FormItem label="手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机: ">
                {getFieldDecorator('phone', {
                  initialValue: !arrValue ? '' : !arrValue.mobile ? '' : arrValue.mobile,
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
                  initialValue:!this.state.mail?'': formatEmail(this.state.mail),
                })(
                  <div>
                    <Input style={{ width: '175px' }} disabled value={this.state.mail} />
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
                  initialValue: !arrValue ? '' : !arrValue.idcard ? '' : arrValue.idcard,
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
                    }],
                })(<Input style={{ width: 280 }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*入职日期">
                {getFieldDecorator('joindate', {
                  initialValue: !arrValue
                    ? moment('2018-09-05', dateFormat)
                    : !arrValue.joindate
                      ? moment('2018-09-05', dateFormat)
                      : moment(formatDateNew(arrValue.joindate), dateFormat),
                  rules: [],
                })(<DatePicker format={dateFormat}  onChange={this.joinDateFun} style={{ width: 280, height: 32 }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*微信部门">
                {getFieldDecorator('wechatDepartmentName', {
                  initialValue: !arrValue
                    ? ''
                    : !arrValue.wechatdepartmentname ? '' : arrValue.wechatdepartmentname,
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
            <Col span={6} offset={9} style={{ textAlign: 'right' }}>
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
                    style={{ marginLeft: '20px' }}
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

export default EditUserForm;
