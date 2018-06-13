import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          用户列表
        </div>
      </PageHeaderLayout>
    );
  }
}

export default UserList;
