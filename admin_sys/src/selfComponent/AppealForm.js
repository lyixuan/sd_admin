import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import common from '../routes/Common/common.css';

const FormItem = Form.Item;
class AccountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
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

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="*姓名">
          {getFieldDecorator('name', {
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
          })(<Input style={{ width: 380 }} />)}
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
                >
                  提交
                </Button>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default AccountForm;
