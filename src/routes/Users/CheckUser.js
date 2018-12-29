import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class CheckUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          查看用户
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CheckUser;
