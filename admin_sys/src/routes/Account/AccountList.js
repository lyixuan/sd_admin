import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class AccountList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          账号列表
        </div>
      </PageHeaderLayout>
    );
  }
}

export default AccountList;
