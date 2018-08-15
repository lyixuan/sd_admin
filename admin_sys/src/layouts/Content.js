import React from 'react';
import styles from './Content.less';

export default ({ children, top }) => {
  return (
    <div style={{ margin: '0' }} className={styles.wrapperClassName}>
      {top}
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
};
