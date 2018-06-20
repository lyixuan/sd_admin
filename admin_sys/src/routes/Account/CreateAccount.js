import React, { Component } from 'react';
import { Form, Button } from 'antd';
import styles from './Account.css';
import AdvancedSearchForm from '../../common/AdvancedSearchForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(AdvancedSearchForm);
class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  createUser = () => {
    this.props.setRouteUrlParams('/account/accountList', {
      a: 2,
      b: 3,
    });
  };
  render() {
    return (
      <ContentLayout
        contentForm={<WrappedRegistrationForm />}
        contentButton={
          <div>
            <Button
              onClick={this.createUser}
              type="primary"
              className={styles.createButton}
              htmlType="cancle"
            >
              取消
            </Button>
            <Button
              onClick={this.createUser}
              type="primary"
              className={styles.createButton}
              htmlType="submit"
            >
              提交
            </Button>
          </div>
        }
      />
    );
  }
}

export default Form.create({ userName: 123 })(CreateAccount);
