import React, { Component } from 'react';
import Content from './Content';
import PageHead from '../selfComponent/pageHead/pageHead';
import styles from './Content.less';

class ContentLayout extends Component {
  render() {
    const flag = !this.props.pageHeraderUnvisible ? 'unvisible' : null;
    const title = !this.props.title ? null : this.props.title;
    const { routerData = null } = this.props;
    return (
      <div>
        {routerData && <PageHead routerData={routerData} />}
        {title && <div className={styles.title}>{title}</div>}
        <Content flag={flag} title={title}>
          {!this.props.contentForm ? null : this.props.contentForm}
          {!this.props.contentButton ? null : this.props.contentButton}
          {!this.props.contentTable ? null : this.props.contentTable}
          {!this.props.contentPagination ? null : this.props.contentPagination}
        </Content>
      </div>
    );
  }
}

export default ContentLayout;
