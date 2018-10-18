import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import common from '../../routes/Common/common.css';
import styles from './PerformanceForm.less';

const FormItem = Form.Item;
class PerformanceForm extends Component {
  constructor(props) {
    super(props);
    // const fromWhere = this.props.jumpFunction.getUrlParams();
    this.state = {
      // id: !fromWhere.id ? '' : fromWhere.id,
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
    const { dataSource } = this.props;
    const { submitLoading } = this.props.jumpFunction;
    return (
      <div className={styles.m_performance}>
        <Row type="flex" justify="start">
          <Col span={12}>
            <span className={styles.u_lableWidth}>身份证号：</span>
            <span>320443456789</span>
          </Col>
          <Col span={12}>
            <span className={styles.u_lableWidth}>
              姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：
            </span>
            <span>张三</span>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={12}>
            <span className={styles.u_lableWidth}>
              岗&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位：
            </span>
            <span>班主任</span>
          </Col>
          <Col span={12}>
            <span className={styles.u_lableWidth}>学院|家族|小组：</span>
            <span>张三</span>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={12}>
            <span className={styles.u_lableWidth}>
              月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份：
            </span>
            <span>320443456789</span>
          </Col>
          <Col span={12}>
            <span className={styles.u_lableWidth}>总包金额：</span>
            <span>张三</span>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={12}>
            <span className={`${styles.u_lableWidth} ${styles.u_wrapWidth}`}>确定绩效：</span>
            <span>320443456789</span>
          </Col>
          <Col span={12}>
            <span className={`${styles.u_lableWidth} ${styles.u_wrapWidth}`}>打分绩效：</span>
            <span>张三</span>
          </Col>
        </Row>

        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row type="flex" justify="start">
            <Col span={12}>
              <FormItem label="实发金额：">
                {getFieldDecorator('money', {
                  initialValue: dataSource.money,
                  rules: [
                    {
                      validator(rule, value, callback) {
                        const reg = !value ? '' : value.replace(/\s*/g, ''); // 去除字符串中全局空格
                        if (!reg) {
                          callback({ message: '实发金额为必填项，请填写!' });
                        } else if (reg.length < 1 || reg.length > 10) {
                          callback({ message: '实发金额在1-10个字符之间，请填写!' });
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(<Input style={{ width: 280, height: 32 }} />)}
                <span className={styles.inputTip}>更新实发金额后，打分绩效=实发金额-基本绩效</span>
              </FormItem>
            </Col>
          </Row>
          <br /> <br />
          <Row type="flex" justify="end">
            <FormItem>
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
                loading={submitLoading}
              >
                提交
              </Button>
            </FormItem>
          </Row>
        </Form>
      </div>
    );
  }
}

export default PerformanceForm;
