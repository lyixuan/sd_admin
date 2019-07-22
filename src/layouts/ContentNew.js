import React from 'react';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import styles from './ContentNew.less';

export default ({ children, top }) => {
  return (
    <LocaleProvider locale={zh_CN}>
      <div>
        {top}
        {children ? <div className={styles.content}>{children}</div> : null}
      </div>
    </LocaleProvider>
  );
};
