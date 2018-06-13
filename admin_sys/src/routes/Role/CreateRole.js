import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          创建角色
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CreateRole;
