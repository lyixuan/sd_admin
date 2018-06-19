import React, { Component } from 'react';
import { Button, Form, Row, Col, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Account.css';

const params = {
  username: '用户名',
  password: '密码',
  email: '邮箱',
};
const FormItem = Form.Item;
let propsVal = '';
class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getFields = () => {
    const count = 3;
    const { getFieldDecorator } = propsVal.form;
    const children = [];
    Object.keys(params).map((key, i) => {
      return children.push(
        <Col span={8} key={key} style={{ display: i < count ? 'block' : 'none' }}>
          <FormItem label={params[key]}>
            {getFieldDecorator(key, {
              rules: [
                {
                  required: true,
                  message: '请输入搜索内容!',
                },
              ],
            })(<Input style={{ textAlign: 'right' }} placeholder={`请输入${params[key]}`} />)}
          </FormItem>
        </Col>
      );
    });
    return children;
  };
  handleSearch = e => {
    e.preventDefault();
    let val = {};
    propsVal.form.validateFields((err, values) => {
      val = values;
    });
    this.props.setCurrentUrlParams(val);
    propsVal.form.setFieldsValue({
      username: 2131,
      password: 222,
    });
  };

  handleReset = () => {
    propsVal.form.resetFields();
    this.props.setCurrentUrlParams({ s: 5 });
  };

  render() {
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
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
    });
    return (
      <PageHeaderLayout>
        <WrappedAdvancedSearchForm />
      </PageHeaderLayout>
    );
  }
}

export default EditAccount;
