import React, { Component } from 'react';

import styles from './PageHeaderLayout.less';

class ContentLayout extends Component {
  constructor(props) {
    super(props);}


  render() {
    console.log(this.props)
    return (
      <div style={{margin: '24px 24px 0'}}>
        {!this.props.contentForm?null:this.props.contentForm}
        {!this.props.contentButton?null:this.props.contentButton}
        {!this.props.contentTable?null:this.props.contentTable}
        {!this.props.contentPagination?null:this.props.contentPagination}
      </div>

    );
  }

}
export default ContentLayout;

// export default ({ children, wrapperClassName }) => {
//   console.log(children)
//   console.log(wrapperClassName)
//   return(
//     <div style={{margin: '-24px -24px 0'}} className={wrapperClassName}>
//
//       {children ? <div className={styles.content}>{children}</div> : null}
//     </div>)
// };
