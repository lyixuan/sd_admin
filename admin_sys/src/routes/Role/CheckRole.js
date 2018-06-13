import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class CheckRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          查看角色
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CheckRole;
