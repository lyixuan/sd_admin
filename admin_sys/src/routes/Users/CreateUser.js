import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          创建用户
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CreateUser;
