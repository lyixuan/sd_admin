import React, { Component } from 'react';
import { Button, Form, Row, Col, Input } from 'antd';
import styles from './AdvancedSearchForm.css';

const FormItem = Form.Item;
class AdvancedSearchForm extends Component {
  // To generate mock Form.Item
  getFields() {
    const count = 4;
    const { getFieldDecorator } = this.props.form;
    const children = [];
    for (let i = 0; i < 10; i += 1) {
      children.push(
        <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
          <FormItem label={`条件 ${i + 1}`}>
            {getFieldDecorator(`条件-${i + 1}`, {
              rules: [
                {
                  required: true,
                  message: '请输入搜索内容!',
                },
              ],
            })(<Input placeholder="搜索" />)}
          </FormItem>
        </Col>
      );
    }
    return children;
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    return (
      <Form className={styles.searchForm} onSubmit={this.handleSearch}>
        <Row gutter={24}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default AdvancedSearchForm;
