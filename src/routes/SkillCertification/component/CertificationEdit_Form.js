/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Spin,
  Radio,
} from 'antd';
import common from '../../Common/common.css';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;


class CertificationEdit_Form extends Component {
  constructor(props) {
    super(props);
    const {timeArea='月度',id=null,name=null,code=null} = this.props.jumpFunction.getUrlParams();

    const timeType=Number(window.BI_Filter(`Certification_TIMEAREA|name:${timeArea}`).id)
    this.state = {
      timeArea:timeType,
      id,
      name,
      code,
    };
  }
  componentDidMount() {

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
      }
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const bol = false
    const disabled = true;
    const { TextArea } = Input;
    const {timeArea=1,id=null,name=null,code=null}=this.state
    const formLayout = 'inline';
    return (
      <Spin spinning={bol}>
        <Form layout={formLayout} onSubmit={this.handleSubmit}>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*排&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序">
                {getFieldDecorator('id', {
                  initialValue: id,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '排序为必填项，请选择!' });
                        }
                        callback();
                      },
                    },
                  ],
                })(<Input style={{ width: 280 }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="&nbsp;&nbsp;认证编码">
                {getFieldDecorator('code', {
                  initialValue: code,
                })(<Input style={{ width: 280 }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*认证项目">
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '认证项目为必填项，请选择!' });
                        }
                        callback();
                      },
                    },
                  ],
                })(<Input style={{ width: 280 }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="*考核周期">
                {getFieldDecorator('sex', {
                  initialValue: timeArea,
                })(
                  <Select style={{ width: 280 }} disabled >
                    <Option value={1}>月度</Option>
                    <Option value={2}>季度</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="&nbsp;&nbsp;标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;准">
                {getFieldDecorator('standard', {
                  initialValue: null,
                })(<TextArea rows={4} style={{ width: 280 }} />)}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="考核形式">
                {getFieldDecorator('method', {
                  initialValue: null,
                })(<TextArea rows={4} style={{ width: 280 }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="&nbsp;&nbsp;是否停用">
                {getFieldDecorator('view', {
                  initialValue: 0,
                })(
                  <RadioGroup style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}>
                    <Radio name="privilege" value={1}>
                      是
                    </Radio>
                    <Radio name="privilege" value={0}>
                      否
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={12} offset={3} style={{ textAlign: 'right' }}>
              <FormItem label="子项是否允许手动输入">
                {getFieldDecorator('view', {
                  initialValue: 0,
                })(
                  <RadioGroup style={{ color: 'rgba(0, 0, 0, 0.85)', width: '280px', textAlign: 'left' }}>
                    <Radio name="privilege" value={1}>
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
                    loading={false}
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

export default CertificationEdit_Form;
