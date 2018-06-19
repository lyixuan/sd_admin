import React, { Component } from 'react';
import PageHeaderLayout from './PageHeaderLayout';

class ContentLayout extends Component {
  // constructor(props) {
  //   super(props);}

  render() {
    return (
      <PageHeaderLayout>
        {!this.props.contentForm ? null : this.props.contentForm}
        {!this.props.contentButton ? null : this.props.contentButton}
        {!this.props.contentTable ? null : this.props.contentTable}
        {!this.props.contentPagination ? null : this.props.contentPagination}
      </PageHeaderLayout>
    );
  }
}

export default ContentLayout;
