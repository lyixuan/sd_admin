import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
class EditRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };

  render() {
    return (
      <PageHeaderLayout>
        <div>
          编辑角色
        </div>
      </PageHeaderLayout>
    );
  }
}

export default EditRole;
