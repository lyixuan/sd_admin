import React from 'react';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import styles from './Content.less';

export default ({ children, top }) => {
  return (
    <LocaleProvider locale={zh_CN}>
      <div style={{ margin: '0' }} className={styles.wrapperClassName}>
        {top}
        {children ? <div className={styles.content}>{children}</div> : null}
      </div>
    </LocaleProvider>
  );
};
