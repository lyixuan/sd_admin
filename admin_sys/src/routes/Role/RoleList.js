import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class RoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          角色列表
        </div>
      </PageHeaderLayout>
    );
  }
}

export default RoleList;
