import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Select, Spin, DatePicker, message } from 'antd';
// import moment from 'moment';
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

  dataChange = (dates, dateStrings) => {
    const aa = dateStrings;
    firstcountBeginTime = aa;
  };

  handleSubmit = e => {
    if (!flag) {
      message.error('请选择申诉类型');
    }
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (flag.substr(0, 2) === '工单' && !values.workorderId) {
          message.error('请输入工单id');
        } else if (flag.substr(0, 2) === 'IM' && !values.consultId) {
          message.error('请输入咨询id');
        } else if (flag === 'IM不及时' && !values.countValue) {
          message.error('请输入申诉个数');
        } else if ((flag === '优新开班电话' || flag === '优新随堂考') && !values.eliminate_value) {
          message.error('请输入删除个数');
        } else {
          this.props.handleSubmit(values, firstcountBeginTime);
        }
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

    const datePicker = (
      <DatePicker
        onChange={this.dataChange}
        format={dateFormat}
        style={{ width: 380, height: 32 }}
      />
    );
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
          {!flag ? null : (
            <>
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
                })(datePicker)}
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

              {!flag ? null : flag === '优新开班电话' || flag === '优新随堂考' ? (
                <FormItem {...formItemLayout} label="*删除数量">
                  {getFieldDecorator('eliminate_value', {
                    initialValue: null,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          const reg = /^(0\.[1-9]{1,2}|0\.0[1-9]{1,2}|1|1\.[0]{0,2})$/;
                          if ((flag === '优新开班电话' || flag === '优新随堂考') && !value) {
                            callback({ message: '删除数量为必填项，请填写！' });
                          } else if (
                            !reg.test(value) &&
                            value &&
                            (flag === '优新开班电话' || flag === '优新随堂考')
                          ) {
                            callback({ message: '请输入0～1的数字,限制到小数点后两位' });
                          }
                          callback();
                        },
                      },
                    ],
                  })(<Input style={{ width: 380 }} placeholder="请输入0～1的数字" />)}
                </FormItem>
              ) : null}

              {!flag ? null : flag.substr(0, 2) === '工单' ? (
                <FormItem {...formItemLayout} label="*工单id">
                  {getFieldDecorator('workorderId', {
                    initialValue: null,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (flag.substr(0, 2) === '工单' && !value) {
                            callback({ message: '工单id为必填项，请填写！' });
                          } else if (isNaN(value) && value && flag.substr(0, 2) === '工单') {
                            callback({ message: '工单id需要是数字组成' });
                          }
                          callback();
                        },
                      },
                    ],
                  })(<Input style={{ width: 380 }} />)}
                </FormItem>
              ) : null}
              {!flag ? null : flag.substr(0, 2) === 'IM' ? (
                <FormItem {...formItemLayout} label="*咨询id">
                  {getFieldDecorator('consultId', {
                    initialValue: null,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (flag.substr(0, 2) === 'IM' && !value) {
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
              ) : null}
              {!flag ? null : flag === 'IM不及时' ? (
                <FormItem {...formItemLayout} label="*申诉个数">
                  {getFieldDecorator('countValue', {
                    initialValue: null,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (flag === 'IM不及时' && !value) {
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
              ) : null}
            </>
          )}
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
