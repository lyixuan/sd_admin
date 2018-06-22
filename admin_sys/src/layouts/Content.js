import React from 'react';
import { Link } from 'dva/router';
import PageHeader from '../components/PageHeader';
import styles from './Content.less';

export default ({ children, wrapperClassName, top, title, flag, ...restProps }) => {
  const visibleFlag = flag;
  console.log(visibleFlag);
  return (
    <div style={{ margin: '0' }} className={wrapperClassName}>
      {top}
      {!visibleFlag ? (
        <div className={styles.title}>{title}</div>
      ) : (
        <PageHeader key="pageheader" {...restProps} linkElement={Link} />
      )}
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
};
