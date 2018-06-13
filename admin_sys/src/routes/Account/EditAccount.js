import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
      <div>
      编辑账号
      </div>
      </PageHeaderLayout>
    );
  }
}

export default EditAccount;
