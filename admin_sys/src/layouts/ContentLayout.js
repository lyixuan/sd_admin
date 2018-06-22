import React, { Component } from 'react';
import Content from './Content';

class ContentLayout extends Component {
  // constructor(props) {
  //   super(props);}

  render() {
    const flag = !this.props.pageHeraderUnvisible ? 'unvisible' : null;
    return (
      <Content flag={flag}>
        {!this.props.contentForm ? null : this.props.contentForm}
        {!this.props.contentButton ? null : this.props.contentButton}
        {!this.props.contentTable ? null : this.props.contentTable}
        {!this.props.contentPagination ? null : this.props.contentPagination}
      </Content>
    );
  }
}

export default ContentLayout;
