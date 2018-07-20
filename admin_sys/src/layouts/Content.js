import React from 'react';
import styles from './Content.less';

export default ({ children, wrapperClassName, top }) => {
  return (
    <div style={{ margin: '0' }} className={wrapperClassName}>
      {top}
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
};
