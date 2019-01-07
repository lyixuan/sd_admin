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
import common from '../../Common/common.css';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;


class CertificationCreate_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {

  }


  handleSelectChange = value => {
    console.log(value)
  };



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

    const formLayout = 'inline';
    return (
      <Spin spinning={bol}>
        <Form layout={formLayout} onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*排&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序">
                {getFieldDecorator('name', {
                  initialValue: null,
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
          </Row>
          <Row>
            <Col span={8} offset={0} style={{ textAlign: 'left' }}>
              <FormItem label="*认证项目">
                {getFieldDecorator('name', {
                  initialValue: null,
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
                  initialValue: null,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        if (!value) {
                          callback({ message: '考核周期为必填项，请选择!' });
                        }
                        callback();
                      },
                    },
                  ],
                })(
                  <Select style={{ width: 280 }}>
                    <Option value={1}>月度</Option>
                    <Option value={2}>季度</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

export default CertificationCreate_Form;
