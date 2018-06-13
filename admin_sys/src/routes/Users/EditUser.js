import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          编辑用户
        </div>
      </PageHeaderLayout>
    );
  }
}

export default EditUser;
