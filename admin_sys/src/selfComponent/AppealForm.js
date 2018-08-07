import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Select, Spin,DatePicker,message } from 'antd';
import common from '../routes/Common/common.css';

const FormItem = Form.Item;
const { Option } = Select;
let flag = '';
const dateFormat = 'YYYY-MM-DD';
let firstcountBeginTime = null;

class AppealForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChange = (dates, dateStrings) => {
    const aa = dateStrings;
    firstcountBeginTime = aa;
  };

  handleSubmit = e => {
    if (!flag){
      message.error('请选择申诉类型');
    }
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('提交时候的values',values)
        this.props.handleSubmit(values,firstcountBeginTime);
        // flag = '';

      }
    });
  };

  handleSelectChange = value => {
    flag = value;
  };

  resetContent = () => {
    flag = '';
    this.props.resetContent();
  };



  render() {
    const { getFieldDecorator } = this.props.form;
    const { submit, loading } = this.props.jumpFunction;
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
      <Spin spinning={loading}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*申诉类型">
            {getFieldDecorator('type', {
              initialValue: '----',
              rules: [
                {
                  validator(rule, value, callback) {
                    if (!value[0]) {
                      callback({ message: '申诉类型为必选项，请选择！' });
                    }
                    callback();
                  },
                },
              ],
            })(
              <Select style={{ width: 380 }} onChange={this.handleSelectChange}>
                <Option value="优新开班电话">优新减分-开班电话</Option>
                <Option value="优新随堂考">优新减分-随堂考</Option>
                <Option value="IM未回复">IM减分-未回复</Option>
                <Option value="IM不及时">IM减分-不及时</Option>
                <Option value="IM不满意">IM减分-不满意</Option>
                <Option value="工单24">工单初次减分</Option>
                <Option value="工单48">工单二次减分</Option>
                <Option value="工单72">工单三次减分</Option>
              </Select>
            )}
          </FormItem>
          <div style={{ display: `${!flag ? 'none' : 'block'}` }}>
            <FormItem {...formItemLayout} label="*学员id">
              {getFieldDecorator('stuId', {
                initialValue: null,
                rules: [
                  {
                    validator(rule, value, callback) {
                      if (isNaN(value) && value) {
                        callback({ message: '学员id需要是数字组成' });
                      }
                      callback();
                    },
                  },
                  { required: true, message: '学员id必填项，请填写!', whitespace: true },
                  { max: 9, message: '学员id长度不得大于9位数字!' },
                ],
              })(<Input style={{ width: 380 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="*扣分时间">
              {getFieldDecorator('countBeginTime', {
                initialValue: null,
                rules: [
                  {
                    validator(rule, value, callback) {
                      if (!value) {
                        callback({ message: '扣分时间为必填项，请选择' });
                      }
                      callback();
                    },
                  },
                ],
              })(<DatePicker format={dateFormat} style={{ width: '380px'}} onChange={this.onChange} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="*订单id">
              {getFieldDecorator('ordId', {
                initialValue: null,
                rules: [
                  {
                    validator(rule, value, callback) {
                      if (isNaN(value) && value) {
                        callback({ message: '学员id需要是数字组成' });
                      }
                      callback();
                    },
                  },
                  { required: true, message: '订单id必填项，请填写!', whitespace: true },
                  { max: 9, message: '订单id长度不得大于9位数字!' },
                ],
              })(<Input style={{ width: 380 }} />)}
            </FormItem>
            <div
              style={{
                display: `${!flag ? 'none' : flag.substr(0, 2) === '工单' ? 'block' : 'none'}`,
              }}
            >
              <FormItem {...formItemLayout} label="*工单id">
                {getFieldDecorator('workorderId', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value && flag.substr(0, 2) === '工单') {
                          callback({ message: '工单id为必填项，请填写！' });
                        } else if (isNaN(value) && value && flag.substr(0, 2) === '工单') {
                          callback({ message: '工单id需要是数字组成' });
                        }
                        callback();
                      },
                    },
                    { max: 9, message: '工单id长度不得大于9位数字!' },
                  ],
                })(<Input style={{ width: 380 }} />)}
              </FormItem>
            </div>
            <div
              style={{
                display: `${!flag ? 'none' : flag.substr(0, 2) === 'IM' ? 'block' : 'none'}`,
              }}
            >
              <FormItem {...formItemLayout} label="*咨询id">
                {getFieldDecorator('consultId', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value && flag.substr(0, 2) === 'IM') {
                          callback({ message: '咨询id为必填项，请填写！' });
                        } else if (isNaN(value) && value && flag.substr(0, 2) === 'IM') {
                          callback({ message: '咨询id需要是数字组成' });
                        }
                        callback();
                      },
                    },
                    { max: 9, message: '咨询id长度不得大于9位数字!' },
                  ],
                })(<Input style={{ width: 380 }} />)}
              </FormItem>
            </div>

            <div
              style={{
                display: `${!flag ? 'none' : flag === 'IM不及时' ? 'block' : 'none'}`,
              }}
            >
              <FormItem {...formItemLayout} label="*申诉个数">
                {getFieldDecorator('countValue', {
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value && flag === 'IM不及时') {
                          callback({ message: '申诉个数为必填项，请填写！' });
                        } else if (value && !/(^[1-9]\d*$)/.test(value) && flag === 'IM不及时') {
                          callback({ message: '申诉个数需要是正整数组成' });
                        }
                        callback();
                      },
                    },
                    { max: 5, message: '申诉个数长度不得大于5位数字!' },
                  ],
                })(<Input style={{ width: 380 }} />)}
              </FormItem>
            </div>

          </div>
          <FormItem {...tailFormItemLayout} />
          <Row>
            <Col span={6} offset={7}>
              <FormItem>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={this.resetContent}
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

export default AppealForm;
