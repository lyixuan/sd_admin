import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          创建账号
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CreateAccount;
